"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Trash } from "lucide-react";
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@/components/ui/shadcn-io/dropzone";

interface SingleImageFieldProps {
  imageUrl: string | null;
  onUpload: (files: File[]) => Promise<string | undefined>;
  onDelete: () => void;
  isUploading: boolean;
  isDeleting: boolean;
  aspectRatio?: "square" | "video" | "banner";
  rounded?: "full" | "2xl" | "xl";
  className?: string;
  maxSize?: number; // in bytes
}

export const SingleImageField: React.FC<SingleImageFieldProps> = ({
  imageUrl,
  onUpload,
  onDelete,
  isUploading,
  isDeleting,
  aspectRatio = "square",
  rounded = "2xl",
  className = "",
  maxSize = 1024 * 1024 * 5, // 5MB default
}) => {
  const [imageError, setImageError] = useState(false);

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
        ? "aspect-video"
        : "aspect-[20/7]";

  const roundedClass =
    rounded === "full"
      ? "rounded-full"
      : rounded === "xl"
        ? "rounded-xl"
        : "rounded-2xl";

  if (isUploading) {
    return (
      <Skeleton
        className={`${aspectClass} w-full ${roundedClass} mt-3 object-cover border ${className}`}
      />
    );
  }

  if (!imageUrl || imageError) {
    return (
      <div>
        {imageError && (
          <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            Gambar gagal dimuat. Silakan unggah gambar baru.
          </div>
        )}
        <Dropzone
          accept={{ "image/*": [] }}
          maxSize={maxSize}
          onDrop={async (acceptedFiles) => {
            setImageError(false);
            await onUpload(acceptedFiles);
          }}
          onError={console.error}
          className="hover:bg-muted bg-white rounded-2xl"
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        width={720}
        height={720}
        alt="Preview"
        onError={() => setImageError(true)}
        className={`${aspectClass} w-full ${roundedClass} mt-3 object-cover border`}
      />
      <Button
        size="sm"
        type="button"
        variant="destructive_outline"
        onClick={onDelete}
        className={`absolute w-10 h-10 top-5 right-2 ${roundedClass}`}
      >
        {isDeleting ? <Spinner /> : <Trash />}
      </Button>
    </div>
  );
};

interface MultipleImageFieldProps {
  imageUrls: string[];
  onUpload: (files: File[]) => Promise<string[] | undefined>;
  onUploadSingle: (files: File[], index: number) => Promise<void>;
  onDelete: (index: number) => void;
  isUploading: boolean;
  isDeleting: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export const MultipleImageField: React.FC<MultipleImageFieldProps> = ({
  imageUrls,
  onUpload,
  onUploadSingle,
  onDelete,
  isUploading,
  isDeleting,
  maxFiles = 5,
  maxSize = 1024 * 1024 * 5,
  className = "",
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );

  if (isUploading) {
    return (
      <div className="lg:grid flex flex-col grid-cols-3 gap-5 mb-3">
        <Skeleton className="aspect-square w-full rounded-2xl object-cover border" />
        <Skeleton className="aspect-square w-full rounded-2xl object-cover border" />
        <Skeleton className="aspect-square w-full rounded-2xl object-cover border" />
      </div>
    );
  }

  if (imageUrls.length === 0) {
    return (
      <Dropzone
        accept={{ "image/*": [] }}
        maxSize={maxSize}
        maxFiles={maxFiles}
        src={[]}
        onDrop={async (acceptedFiles) => {
          await onUpload(acceptedFiles);
        }}
        onError={console.error}
        className="hover:bg-muted bg-white rounded-2xl"
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    );
  }

  return (
    <div
      className={`lg:grid flex flex-col grid-cols-3 gap-5 mb-3 ${className}`}
    >
      {imageUrls.map((url, i) => (
        <div key={url} className="relative">
          {imageErrors[i] ? (
            <div className="aspect-square w-full rounded-2xl mt-3 border bg-red-50 flex flex-col items-center justify-center p-4">
              <p className="text-sm text-red-600 text-center mb-3">
                Gambar gagal dimuat
              </p>
              <Dropzone
                accept={{ "image/*": [] }}
                maxSize={maxSize}
                maxFiles={1}
                onDrop={async (acceptedFiles) => {
                  await onUploadSingle(acceptedFiles, i);
                  setImageErrors((prev) => ({
                    ...prev,
                    [i]: false,
                  }));
                }}
                onError={console.error}
                className="hover:bg-muted bg-white rounded-xl w-full"
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
            </div>
          ) : (
            <>
              <Image
                src={url}
                width={320}
                height={320}
                alt={url}
                onError={() =>
                  setImageErrors((prev) => ({
                    ...prev,
                    [i]: true,
                  }))
                }
                className="aspect-square w-full rounded-2xl mt-3 object-cover border"
              />
              <Button
                size="sm"
                type="button"
                variant="destructive_outline"
                onClick={() => onDelete(i)}
                className="absolute w-10 h-10 top-5 right-2 rounded-full"
              >
                {isDeleting ? <Spinner /> : <Trash />}
              </Button>
            </>
          )}
        </div>
      ))}
      {imageUrls.length < maxFiles && (
        <Dropzone
          accept={{ "image/*": [] }}
          maxSize={maxSize}
          maxFiles={maxFiles - imageUrls.length}
          src={[]}
          onDrop={async (acceptedFiles) => {
            await onUpload(acceptedFiles);
          }}
          onError={console.error}
          className="hover:bg-muted bg-white rounded-2xl"
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      )}
    </div>
  );
};

// Helper hook untuk mengelola error state gambar
export const useImageErrorHandling = () => {
  const [singleErrors, setSingleErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [multiErrors, setMultiErrors] = useState<{
    [key: string]: { [index: number]: boolean };
  }>({});

  const setSingleError = (fieldName: string, hasError: boolean) => {
    setSingleErrors((prev) => ({ ...prev, [fieldName]: hasError }));
  };

  const setMultiError = (
    fieldName: string,
    index: number,
    hasError: boolean,
  ) => {
    setMultiErrors((prev) => ({
      ...prev,
      [fieldName]: { ...(prev[fieldName] || {}), [index]: hasError },
    }));
  };

  const getSingleError = (fieldName: string) =>
    singleErrors[fieldName] || false;
  const getMultiError = (fieldName: string, index: number) =>
    multiErrors[fieldName]?.[index] || false;

  const resetSingleError = (fieldName: string) => {
    setSingleErrors((prev) => ({ ...prev, [fieldName]: false }));
  };

  const resetMultiError = (fieldName: string, index: number) => {
    setMultiErrors((prev) => ({
      ...prev,
      [fieldName]: { ...(prev[fieldName] || {}), [index]: false },
    }));
  };

  return {
    setSingleError,
    setMultiError,
    getSingleError,
    getMultiError,
    resetSingleError,
    resetMultiError,
  };
};
