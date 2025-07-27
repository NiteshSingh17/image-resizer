import { put } from "@vercel/blob";
import sharp from "sharp";
import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { Form } from "multiparty";
import fs from 'fs/promises';

export type ResizeImageResponse = {
  success: boolean;
  message?: string;
  zipUrl?: string;
  fileName?: string;
  totalImages?: number;
  zipSize?: number;
  error?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

function bufferToMockRequestStream(
  buffer: Buffer,
  headers: Headers
): IncomingMessage {
  const stream = Readable.from(buffer);
  const nodeHeaders: Record<string, string> = Object.fromEntries(
    headers.entries()
  );
  return Object.assign(stream, {
    headers: nodeHeaders,
    method: "POST",
    url: "",
    on: stream.on.bind(stream),
    once: stream.once.bind(stream),
    removeListener: stream.removeListener.bind(stream),
  }) as IncomingMessage;
}

export async function POST(req: NextRequest) {
  const buffer = Buffer.from(await req.arrayBuffer());
  const nodeRequest = bufferToMockRequestStream(buffer, req.headers);

  // Use /tmp for temporary processing
  const form = new Form({ uploadDir: "/tmp" });

  return await new Promise<Response>((resolve) => {
    form.parse(nodeRequest, async (err, fields, allfiles) => {
      const files = allfiles['files[]'];
      if (err) {
        return resolve(
          new Response(
            JSON.stringify({
              error: "Form parse failed",
              details: err.message,
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      }

      try {
        const format = fields.format;
        const width = parseInt(fields.width as unknown as string) || 1280;
        const height = parseInt(fields.height as unknown as string) || 720;

        if (!Array.isArray(files) || files.length === 0) { 
            return resolve(new Response(
              JSON.stringify({ 
                success: false,
                error: "No files provided",
              }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }));
        }

        // Create zip instance
        const zip = new JSZip();

        // Process each image and add to zip
        await Promise.all(
          files.map(async (file, index: number) => { 
            // Convert File to Buffer
            const arrayBuffer = await fs.readFile(file.path);  
            const fileBuffer = Buffer.from(arrayBuffer);

            // Resize the image
            const resizedBuffer = await sharp(fileBuffer)
              .resize(width, height, {
                fit: format ?? "cover",
              })
              .png({ quality: 100 })
              .toBuffer();

            // Generate filename for zip entry
            const fileName = `icon-${index + 1}-${width}x${height}.png`;
            // Add resized image to zip
            zip.file(fileName, resizedBuffer);
          })
        );

        // Generate zip buffer
        const zipBuffer = await zip.generateAsync({
          type: "nodebuffer",
          compression: "DEFLATE",
          compressionOptions: {
            level: 6,
          },
        });
        console.log("zipBuffer");

        // Generate unique zip filename
        const zipFileName = `resized_images_${Date.now()}.zip`;

        // Upload zip to Vercel Blob Storage
        const blob = await put(zipFileName, zipBuffer, {
          access: "public",
          contentType: "application/zip",
        });

        console.log("blob", blob);
            resolve(new Response(
              JSON.stringify({ 
                success: true,
                message: `Zip file with ${files.length} resized images uploaded successfully`,
                zipUrl: blob.url,
                fileName: zipFileName,
                totalImages: files.length,
                zipSize: zipBuffer.length,
              }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }));
      } catch (error) {
            resolve(new Response(
              JSON.stringify({ 
                success: false,
                message: "Error processing images",
                error: error instanceof Error ? error.message : "Unknown error",
              }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }));
      }
    });
  });
}
