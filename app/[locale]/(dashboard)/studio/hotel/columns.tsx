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
import { DataTableColumnHeader } from "@/components/utility/table/data-table-column-header";
import { routing } from "@/i18n/routing";
import { deleteHotel } from "@/lib/hotel/delete-hotel";
import { deleteVendor } from "@/lib/vendors/delete-vendor";
import { VendorType } from "@/types/vendor.types";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "boring-avatars";
import {
  Check,
  Copy,
  CopyCheck,
  MoreHorizontal,
  PenSquare,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
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
      return <span className="uppercase">{id.slice(0, 8)}</span>;
    },
  },
  {
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),

    cell: ({ row }) => {
      const logo: string = row.getValue("logo");
      const name: string = row.getValue("name");

      const [error, setError] = useState(false);

      // Jika tidak ada logo atau sudah error → tampilkan avatar
      if (!logo || error) {
        return (
          <Avatar
            name={name}
            className="w-10! h-10! border rounded-full"
            colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
            variant="beam"
            size={20}
          />
        );
      }

      return (
        <Image
          src={logo}
          alt={name || "Vendor Logo"}
          width={40}
          height={40}
          className="object-cover w-10 h-10 rounded-full border"
          onError={() => setError(true)}
        />
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("name");
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
            <span className="bg-health px-2 py-1 rounded-lg text-white text-xs! mr-2">
              New
            </span>
          )}
          {name}
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const hotelName: string = row.getValue("name");

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
          await navigator.clipboard.writeText(hotelName);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.warning("Failed to Copy Name", { description: `${err}` });
        }
      };

      const handleDeleteHotel = async () => {
        try {
          setLoading(true);
          const res = await deleteHotel(id);
          if (!res.error) {
            toast.success("Success to Delete Hotel", {
              description: `${id.slice(0, 8).toUpperCase()} - ${hotelName}`,
            });
          } else if (res.error) {
            toast.error("Failed to Delete Hotel", {
              description: `${res.error}`,
            });
          }
          setLoading(false);
          router.refresh();
        } catch (err) {
          setLoading(false);
          toast.warning("Failed to Delete Hotel", { description: `${err}` });
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
                    router.push(`/${locale}/studio/hotel/update/${id}`)
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
                      ? "Konfirmasi Penghapusan Hotel"
                      : "Delete Hotel Confirmation"}
                  </h6>
                </DialogTitle>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Untuk menghapus hotel ini, silahkan ketik nama hotel:"
                    : "To delete this hotel, please type the hotel name:"}{" "}
                  <span
                    className="font-medium inline-flex items-center gap-2 bg-muted rounded-md px-2"
                    onClick={handleCopyName}
                  >
                    {hotelName}{" "}
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
                    ? "Tulis nama hotel di sini"
                    : "Write hotel name here"
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
                  disabled={inputName !== hotelName}
                  onClick={async () => {
                    await handleDeleteHotel();
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
