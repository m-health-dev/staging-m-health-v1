"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../ui/shadcn-io/dropzone";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export function DialogUploadImage({ open, onClose, onUploaded }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoadingContentImage, setUploadingContentImage] = useState(false);
  const [contentPreview, setContentsPreview] = useState<string | null>(null);

  async function handleImageUpload(files: File[]) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "contents");
    // formData.append("field", "referenceImage");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data.url) {
        toast.success("Image uploaded!", {
          description: `${data.url}`,
        });
        onUploaded(data.url); // kirim URL ke parent
        setFile(null);
        onClose();
        setLoading(false);
      }

      return data.url;
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { description: `${error}` });
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle asChild>
            <h5 className="text-primary">Upload Gambar</h5>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <Skeleton className="aspect-video w-full" />
        ) : (
          <Dropzone
            accept={{ "image/*": [] }}
            maxSize={1024 * 1024 * 5}
            onDrop={async (acceptedFiles) => {
              setUploadingContentImage(true);
              const url = await handleImageUpload(acceptedFiles);

              if (url) {
                setContentsPreview(url);
                setUploadingContentImage(false);
              }
            }}
            onError={console.error}
            className="hover:bg-muted bg-white rounded-2xl"
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        )}
      </DialogContent>
    </Dialog>
  );
}
