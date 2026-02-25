"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import StatusBadge from "@/components/utility/status-badge";
import { DataTableColumnHeader } from "@/components/utility/table/data-table-column-header";
import { routing } from "@/i18n/routing";
import { deleteArticles } from "@/lib/articles/delete-articles";

import { ArticleType } from "@/types/articles.types";

import { ColumnDef } from "@tanstack/react-table";

import {
  Check,
  Copy,
  CopyCheck,
  MoreHorizontal,
  PenSquare,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<ArticleType>[] = [
  //   {
  //     id: "number",
  //     cell: ({ row }) => {
  //       return row.index + 1;
  //     },
  //   },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <span className="uppercase">{id.slice(0, 8)}</span>;
    },
  },
  {
    accessorKey: "id_title",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Title" />
    ),
    cell: ({ row }) => {
      const id_title: string = row.getValue("id_title");
      const createdAt: Date = new Date(row.getValue("created_at"));
      const now = new Date();

      const isSameDay =
        createdAt.getFullYear() === now.getFullYear() &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getDate() === now.getDate();

      // console.log({ createdAt, now, isSameDay });

      return (
        <span className="text-wrap">
          {isSameDay && (
            <span className="bg-health px-2 py-1 rounded-full text-white text-xs! mr-2">
              New
            </span>
          )}
          {id_title}
        </span>
      );
    },
  },
  {
    accessorKey: "en_title",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EN Title" />
    ),
    cell: ({ row }) => {
      const en_title: string = row.getValue("en_title");
      return <span className="text-wrap">{en_title}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const created_at: string = row.getValue("created_at");
      return <LocalDateTime date={created_at} />;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
    cell: ({ row }) => {
      const updated_at: string = row.getValue("updated_at");
      return <LocalDateTime date={updated_at} />;
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return <StatusBadge status={status} />;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const id_title: string = row.getValue("id_title");

      const [copied, setCopied] = useState(false);
      const [openConfirm, setOpenConfirm] = useState(false);
      const [inputName, setInputName] = useState("");
      const [loading, setLoading] = useState(false);

      const router = useRouter();
      const locale = useLocale();

      const handleCopyLink = async () => {
        try {
          await navigator.clipboard.writeText(id);
          setCopied(true);
          toast.success("Success to Copy", { description: `${id}` });
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.warning("Failed to Copy ID", { description: `${err}` });
        }
      };

      const handleCopyName = async () => {
        try {
          await navigator.clipboard.writeText(id_title);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.warning("Failed to Copy Name", { description: `${err}` });
        }
      };

      const handleDelete = async () => {
        try {
          setLoading(true);
          const res = await deleteArticles(id);
          if (!res.error) {
            toast.success("Success to Delete Article", {
              description: `${id.slice(0, 8).toUpperCase()} - ${id_title}`,
            });
          } else if (res.error) {
            toast.error("Failed to Delete Article", {
              description: `${res.error}`,
            });
          }
          setLoading(false);
          router.refresh();
        } catch (err) {
          setLoading(false);
          toast.warning("Failed to Article", { description: `${err}` });
        }
      };

      return (
        <>
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <p
                  className="text-sm! text-muted-foreground"
                  onClick={() =>
                    router.push(`/${locale}/studio/article/update/${id}`)
                  }
                >
                  <PenSquare />
                  Update Data
                </p>
              </DropdownMenuItem>

              {/* Trigger Modal */}
              <DropdownMenuItem asChild onClick={() => setOpenConfirm(true)}>
                <p className="text-sm! text-muted-foreground">
                  <Trash2 />
                  Delete Data
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem asChild onClick={handleCopyLink}>
                <p className="text-sm! text-muted-foreground">
                  {!copied ? (
                    <Copy className="size-4" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Copy ID
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <span className="lg:hidden flex flex-col w-full items-center space-y-3">
            <Button
              variant={"default"}
              className="flex w-full"
              onClick={() =>
                router.push(`/${locale}/studio/hotel/update/${id}`)
              }
            >
              <PenSquare />
              Update Data
            </Button>

            <Button
              variant={"destructive_outline"}
              className="flex w-full"
              onClick={() => setOpenConfirm(true)}
            >
              <Trash2 />
              Delete Data
            </Button>

            <Button
              className="flex w-full"
              variant={"outline"}
              onClick={handleCopyLink}
            >
              {!copied ? (
                <Copy className="size-4" />
              ) : (
                <Check className="size-4" />
              )}
              Copy ID
            </Button>
          </span> */}

          {/* Modal Konfirmasi */}
          <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle asChild>
                  <h6 className="text-red-500">
                    {locale === routing.defaultLocale
                      ? "Konfirmasi Penghapusan Article"
                      : "Delete Article Confirmation"}
                  </h6>
                </DialogTitle>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Untuk menghapus Article ini, silahkan ketik nama Article:"
                    : "To delete this Article, please type the Article name:"}{" "}
                  <span
                    className="font-medium inline-flex items-center gap-2 bg-muted rounded-md px-2"
                    onClick={handleCopyName}
                  >
                    {id_title}{" "}
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
                    ? "Tulis nama Article di sini"
                    : "Write Article name here"
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
                  disabled={inputName !== id_title || loading}
                  onClick={async () => {
                    await handleDelete();
                    setOpenConfirm(false);
                  }}
                >
                  {loading ? <Spinner /> : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
