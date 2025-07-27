'use client';
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from './Button';
import Image from 'next/image';

export type FileWithPreview = {
  file: File;
  preview: string;
};

interface FileSelectDropProps {
  onFileSelect?: (files: FileWithPreview[]) => void;
  isLoading: boolean;
  acceptedTypes?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export const FileSelectDrop: React.FC<FileSelectDropProps> = ({
  onFileSelect,
  isLoading,
  acceptedTypes = "*",
  multiple = false,
  maxSize = 10,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    console.log("file ", file)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    if (!file.type.includes('image/')) { 
      setError(`File type must be ${acceptedTypes}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      const newFiles = multiple ? [...validFiles] : validFiles;
      const filesWithPreview = newFiles.map(file => ({
        file: file,
        preview: URL.createObjectURL(file),
      }))
      updateFiles(filesWithPreview);
    }
  };

  const updateFiles = (files: FileWithPreview[]) => {
    onFileSelect?.(files);
    setSelectedFiles(files);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileSelector = () => {
    inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if(selectedFiles.length > 0)
        onFileSelect?.(selectedFiles);
  }

  return (
    <div className={`w-full max-w-xl h-full mx-auto ${className}`}>
      <div
        className={`
          relative py-20 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleInputChange}
        />
        
        <div className="flex flex-col items-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
            </svg>

          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>
            {' '}or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {acceptedTypes === "*" ? "Any file type" : acceptedTypes} 
            {' '}(max {maxSize}MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
          {selectedFiles.map((fileDetails, index) => {
            const file = fileDetails.file;
            return (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <Image src={fileDetails.preview} alt={file.name} width={100} height={100} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
              </div>
            </div>
          )})}
        </div>
      )}

    </div>
  );
};
