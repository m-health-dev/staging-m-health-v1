"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Input } from "../ui/input";

export function DialogRichLink({ open, onClose, onSubmit, url, setUrl }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle asChild>
            <h5 className="text-primary">Tambahkan Link</h5>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            placeholder="https://google.com"
            className="h-12"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              if (!url) return;
              onSubmit(url);
              setUrl("");
              onClose(false);
            }}
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
