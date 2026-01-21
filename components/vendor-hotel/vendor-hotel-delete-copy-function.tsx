import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export function VendorHotelDeleteCopyFunction({
  id,
  name,
  locale,
  resourceType,
  deleteAction,
  router,
  slug,
}: {
  id: string;
  name: string;
  locale?: string;
  resourceType: string;
  deleteAction: (id: string) => Promise<{ error?: string }>;
  router: ReturnType<typeof useRouter>;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [inputName, setInputName] = useState("");
  const [loading, setLoading] = useState(false);

  const resourceLabel =
    resourceType === "vendor"
      ? "Vendor"
      : resourceType === "hotel"
        ? "Hotel"
        : "Insurance";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      toast.success("Success to Copy", { description: `${slug}` });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.warning("Failed to Copy Slug", { description: `${err}` });
    }
  };

  const handleCopyName = async () => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      toast.success("Success to Copy Name", { description: name });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.warning("Failed to Copy Name", { description: `${err}` });
    }
  };

  const handleDelete = async () => {
    if (!deleteAction) {
      toast.error("Delete function not available.");
      return;
    }

    setLoading(true);

    try {
      const res = await deleteAction(id);

      if (!res?.error) {
        toast.success(`${resourceLabel} deleted successfully`, {
          description: `${id.slice(0, 8)} - ${name}`,
        });
        setOpenConfirm(false);
        setInputName("");
        router.refresh();
      } else {
        toast.error(`Failed to delete ${resourceLabel}`, {
          description: res.error,
        });
      }
    } catch (err: any) {
      toast.error(`Failed to delete ${resourceLabel}`, {
        description: err.message || String(err),
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="rounded-2xl"
        onClick={handleCopyLink}
      >
        {!copied ? <Copy className="size-4" /> : <Check className="size-4" />}
        {/* <span className="lg:flex hidden">Copy Preview Link</span> */}
      </Button>
      <Button
        variant="destructive_outline"
        className="rounded-2xl"
        onClick={() => setOpenConfirm(true)}
      >
        <Trash2 className="size-4" />
        {/* <span className="lg:flex hidden">Delete Data</span> */}
      </Button>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle asChild>
              <h6 className="text-red-500">
                {locale === routing.defaultLocale
                  ? `Konfirmasi Penghapusan ${resourceLabel}`
                  : `Delete ${resourceLabel} Confirmation`}
              </h6>
            </DialogTitle>
            <p className="text-muted-foreground">
              {locale === routing.defaultLocale
                ? `Untuk menghapus ${resourceLabel} ini, silahkan ketik nama ${resourceLabel}:`
                : `To delete this ${resourceLabel}, please type the ${resourceLabel} name:`}{" "}
              <span
                className="font-medium inline-flex items-center gap-2 bg-muted rounded-md px-2"
                onClick={handleCopyName}
              >
                {name}{" "}
                {!copied ? (
                  <Copy className="size-4" />
                ) : (
                  <Check className="size-4" />
                )}
              </span>
            </p>
          </DialogHeader>

          {/* Input Konfirmasi */}
          <Input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full border px-3 py-2 h-12 rounded-2xl"
            placeholder={
              locale === routing.defaultLocale
                ? `Tulis nama ${resourceLabel.toLowerCase()} di sini`
                : `Write ${resourceLabel.toLowerCase()} name here`
            }
          />
          <p className="text-xs! text-red-500">
            {locale === routing.defaultLocale
              ? "Tindakan ini tidak dapat dibatalkan. Mohon lakukan dengan hati-hati."
              : "This action cannot be undone. Please proceed with caution."}
          </p>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                setOpenConfirm(false);
                setInputName("");
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="rounded-2xl"
              type="submit"
              disabled={inputName !== name}
              onClick={handleDelete}
            >
              {loading ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
