'use client';
import Image from "next/image";
import { FileWithPreview } from "../FileSelectDrop";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { Button } from "../Button";
import clsx from "clsx";
import { useResizeImage } from "@/services/resizeImage";

type ResizeImageProps = {
  files: FileWithPreview[];
};

export const ResizeImage = ({ files }: ResizeImageProps) => {
  const [format, setFormat] = useState("cover");
  const firstFile = files[0];
  const [size, setSize] = useState({
    width: 128,
    height: 128,
  });

  const { mutate: resizeImage, isPending } = useResizeImage({
    onSuccess: (data) => {
      window.open(data.zipUrl, '_blank');
      console.log("data", data);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const handleResizeImage = () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files[]", file.file);
    });
    formData.append("format", format);
    formData.append("width", size.width.toString());
    formData.append("height", size.height.toString());

    resizeImage(formData);
  };

  return !firstFile ? null : (
    <div className="bg-gray-100 flex flex-col justify-between border-l-1 border-gray-300 px-4 py-10 h-screen overflow-auto">
      <div className="grow overflow-auto">
        <h1 className="font-bold">Compress to</h1>
        <div className="mt-4 flex flex-col gap-4">
          <PreviewCard
            selectedSize={size}
            onChangeSize={setSize}
            title="Store icon"
            description="128 x 128 pixels"
            file={firstFile}
            size={{ width: 128, height: 128 }}
          />
          <PreviewCard
            selectedSize={size}
            onChangeSize={setSize}
            title="Screenshots"
            description="1,280 x 800 pixels"
            file={firstFile}
            size={{ width: 1280, height: 800 }}
          />
          <PreviewCard
            selectedSize={size}
            onChangeSize={setSize}
            title="Small promo tile"
            description="440 x 280 pixels"
            file={firstFile}
            size={{ width: 440, height: 280 }}
          />
          <PreviewCard
            selectedSize={size}
            onChangeSize={setSize}
            title="Marquee promo tile"
            description="1400 x 560 pixels"
            file={firstFile}
            size={{ width: 1400, height: 560 }}
          />
        </div>
        <div className="mt-4 flex gap-4 justify-between">
          <h2 className="">Image fill format</h2>
          <select value={format} className="bg-white px-2" onChange={(e) => setFormat(e.target.value)}>
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="inside">Inside</option>
            <option value="outside">Outside</option>
          </select>
        </div>
      </div>
      <Button loading={isPending} onClick={handleResizeImage}>
        Download all
      </Button>
    </div>
  );
};

const PreviewCard = ({
  title,
  description,
  file,
  selectedSize,
  size,
  onChangeSize,
}: {
  title: string;
  description: string;
  file: FileWithPreview;
  selectedSize: {
    width: number;
    height: number;
  };
  size: {
    width: number;
    height: number;
  };
  onChangeSize: (data: { width: number; height: number }) => void;
}) => {
  const isSelected =
    selectedSize.width === size.width && selectedSize.height === size.height;
  const [resizeImageUrl, setResizeImageUrl] = useState(file.preview);

  const handleChangeSize = () => {
    onChangeSize({ width: size.width, height: size.height });
  };

  useEffect(() => {
    const getFile = async () => {
      Resizer.imageFileResizer(
        file.file,
        size.width,
        size.height,
        "JPEG",
        100,
        0,
        (uri) => {
          return setResizeImageUrl(
            typeof uri === "string" ? uri : URL.createObjectURL(uri)
          );
        },
        "base64",
        size.width,
        size.height
      );
    };
    getFile();
  }, [file.preview, size]);

  return (
    <div
      onClick={handleChangeSize}
      className={clsx(
        "flex gap-6 bg-white border-1 border-gray-300 p-4 rounded-lg p-4",
        {
          "border-green-400 border-2 bg-green-100": isSelected,
        }
      )}
    >
      <Image
        className={clsx("border border-gray-200 w-[100px] h-[100px]")}
        src={resizeImageUrl}
        alt="image"
        width={100}
        height={100}
        objectFit="cover"
      />
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-0 grow">
          <h2 className="font-bold mb-0">{title}</h2>
          <p className="text-xs">{description}</p>
        </div>
        {isSelected ? (
          <div className="text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-badge-check-icon lucide-badge-check"
            >
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        ) : null}
      </div>
    </div>
  );
};
