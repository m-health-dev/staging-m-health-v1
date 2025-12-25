"use client";

import AvatarUserDetail from "@/components/auth/AvatarUserDetail";
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
import { DeleteChatSession } from "@/lib/chatbot/delete-chat-activity";
import { deleteMedical } from "@/lib/medical/delete-medical";
import { deletePackage } from "@/lib/packages/delete-packages";
import { VendorType } from "@/types/vendor.types";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "boring-avatars";
import {
  Check,
  Copy,
  CopyCheck,
  Eye,
  MoreHorizontal,
  PenSquare,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<VendorType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return (
        <span className="uppercase line-clamp-1">
          {id ? id.slice(0, 8) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title: string = row.getValue("title");
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
          {title}
        </span>
      );
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
    accessorKey: "public_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Public ID" />
    ),
    cell: ({ row }) => {
      const public_id: string = row.getValue("public_id");
      return (
        <span className="uppercase line-clamp-1">
          {public_id ? public_id.slice(0, 8) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: ({ row }) => {
      const public_id: string = row.getValue("public_id");
      const user_id: string = row.getValue("user_id");
      const locale = useLocale();
      if (user_id) {
        return (
          <Link href={`/${locale}/studio/users/preview/${user_id}`}>
            <span className="uppercase inline-flex gap-2 items-center">
              <span className="bg-green-500 w-2 h-2 rounded-full aspect-square" />
              {user_id ? user_id.slice(0, 8) : "N/A"}{" "}
            </span>
          </Link>
        );
      } else {
        return (
          <span className="uppercase inline-flex gap-2 items-center">
            <span className="bg-red-500 w-2 h-2 rounded-full aspect-square" />
            {public_id ? public_id.slice(0, 8) : "N/A"}{" "}
          </span>
        );
      }
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const title: string = row.getValue("title");

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
          await navigator.clipboard.writeText(title);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.warning("Failed to Copy Name", { description: `${err}` });
        }
      };

      const handleDeleteChatSession = async () => {
        try {
          setLoading(true);
          const res = await DeleteChatSession(id);
          if (!res.error) {
            toast.success("Success to Delete Chat Session", {
              description: `${title.toUpperCase()} - ${title}`,
            });
          } else if (res.error) {
            toast.error("Failed to Delete Chat Session", {
              description: `${res.error}`,
            });
          }
          setLoading(false);
          router.refresh();
        } catch (err) {
          setLoading(false);
          toast.warning("Failed to Chat Session", { description: `${err}` });
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
                    router.push(`/${locale}/studio/chat-activity/preview/${id}`)
                  }
                >
                  <Eye />
                  Preview Chat
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
                      ? "Konfirmasi Penghapusan Sesi Percakapan"
                      : "Delete Chat Session Confirmation"}
                  </h6>
                </DialogTitle>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Untuk menghapus Sesi Percakapan ini, silahkan ketik nama Sesi Percakapan:"
                    : "To delete this Chat Session, please type the Chat Session name:"}{" "}
                  <span
                    className="font-medium inline-flex items-center gap-2 bg-muted rounded-md px-2"
                    onClick={handleCopyName}
                  >
                    {title}{" "}
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
                    ? "Tulis judul Sesi Percakapan di sini"
                    : "Write Chat Session name here"
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
                  disabled={inputName !== title}
                  onClick={async () => {
                    await handleDeleteChatSession();
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
