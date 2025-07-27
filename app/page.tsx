"use client";
import { FileSelectDrop, FileWithPreview } from "@/components/FileSelectDrop";
import { ResizeImage } from "@/components/resizeImage";
import clsx from "clsx";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  return (
    <div className="flex p-4 lg:p-0 items-center justify-items-center">
      <div className="flex flex-col lg:flex-row flex-wrap w-full items-center justify-center">
        <div
          className={clsx(
            "sm:p-20 w-full lg:min-h-screen flex flex-col items-center justify-center gap-2",
            {
              "lg:w-2/3": files.length > 0,
            }
          )}
        >
          <FileSelectDrop
            multiple
            onFileSelect={setFiles}
            className="w-full"
            acceptedTypes="image/*"
            isLoading={false}
          />
        </div>
        {files.length > 0 && (
          <div className="bg-gray-50 w-full lg:w-1/3">
            <ResizeImage files={files} />
          </div>
        )}
      </div>
    </div>
  );
}
