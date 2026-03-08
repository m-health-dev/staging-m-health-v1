"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  patchErrorLogStatus,
  deleteErrorLog,
} from "@/lib/error-logs/patch-error-logs";
import { invalidateStatusCache } from "../StatusErrorBadge";
import { ErrorLogStatus } from "@/types/error-logs.types";
import {
  Check,
  ClipboardClock,
  SearchCheck,
  Settings,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OPTIONS: { value: ErrorLogStatus; label: string; color: string }[] = [
  {
    value: "recorded",
    label: "Recorded",
    color:
      "bg-gray-100 text-gray-700 hover:text-gray-700 border-gray-400 hover:bg-gray-200",
  },
  {
    value: "acknowledge",
    label: "Acknowledge",
    color:
      "bg-yellow-100 text-yellow-700 hover:text-yellow-700 border-yellow-400 hover:bg-yellow-200",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    color:
      "bg-blue-100 text-blue-700 hover:text-blue-700 border-blue-400 hover:bg-blue-200",
  },
  {
    value: "resolved",
    label: "Resolved",
    color:
      "bg-green-100 text-green-700 hover:text-green-700 border-green-400 hover:bg-green-200",
  },
];

export default function ErrorLogStatusEditor({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: ErrorLogStatus | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<ErrorLogStatus | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleUpdate = async (status: ErrorLogStatus) => {
    setLoading(status);
    const res = await patchErrorLogStatus(id, status);
    if (res.success) {
      invalidateStatusCache(id);
      toast.success(`Status updated to "${status}"`);
      router.refresh();
    } else {
      toast.error("Failed to update status", { description: res.error });
    }
    setLoading(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteErrorLog(id);
    if (res.success) {
      toast.success("Error log deleted");
      router.push("../error-logs");
    } else {
      toast.error("Failed to delete", { description: res.error });
      setDeleting(false);
    }
    setOpenConfirm(false);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm! text-muted-foreground">Status</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => {
          const isActive = currentStatus === opt.value;
          const isLoading = loading === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              variant="outline"
              disabled={!!loading}
              onClick={() => handleUpdate(opt.value)}
              className={cn(
                "rounded-full border h-10 px-4 text-sm! font-medium transition-all",
                opt.color,
                isActive && "ring-2 ring-offset-1 ring-current font-bold",
              )}
            >
              {opt.value === "recorded" && <ClipboardClock />}
              {opt.value === "acknowledge" && <SearchCheck />}
              {opt.value === "maintenance" && <Settings />}
              {opt.value === "resolved" && <Check />}
              {opt.label}
              {isLoading ? <Spinner className="size-4 ml-1" /> : null}
            </Button>
          );
        })}
      </div>
      <div className="pt-5 border-t mt-5">
        <Button
          type="button"
          variant="destructive"
          disabled={!!loading || deleting}
          onClick={() => setOpenConfirm(true)}
          className="rounded-full h-10 px-4 text-sm!"
        >
          {deleting ? (
            <Spinner className="size-4 mr-1" />
          ) : (
            <Trash2 className="size-4 mr-1" />
          )}
          Delete Log
        </Button>
      </div>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle asChild>
              <h6 className="text-red-500">Delete Error Log</h6>
            </DialogTitle>
            <p className="text-muted-foreground text-sm!">
              Are you sure you want to permanently delete this error log? This
              action cannot be undone.
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => setOpenConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-2xl"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? <Spinner className="size-4" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
