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
import { deleteUsers } from "@/lib/users/delete-users";
import { UsersType } from "@/types/account.types";
import { ContactType } from "@/types/contact.types";
import { ErrorLogType } from "@/types/error-logs.types";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "boring-avatars";
import {
  Check,
  Copy,
  Eye,
  MoreHorizontal,
  PenSquare,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<ErrorLogType>[] = [
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
    accessorKey: "ray_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ray ID" />
    ),
    cell: ({ row }) => {
      const ray_id: string = row.getValue("ray_id");
      return <span className="uppercase">{ray_id}</span>;
    },
  },

  {
    accessorKey: "pathname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pathname" />
    ),
    cell: ({ row }) => {
      const pathname: string = row.getValue("pathname");
      return <span>{pathname}</span>;
    },
  },

  {
    accessorKey: "ip_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP Address" />
    ),
    cell: ({ row }) => {
      const ip_address: string = row.getValue("ip_address");
      return <span>{ip_address}</span>;
    },
  },

  {
    accessorKey: "browser",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Browser" />
    ),
    cell: ({ row }) => {
      const browser: string = row.getValue("browser");
      return <span>{browser}</span>;
    },
  },

  {
    accessorKey: "os",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OS" />
    ),
    cell: ({ row }) => {
      const os: string = row.getValue("os");
      return <span>{os}</span>;
    },
  },

  {
    accessorKey: "device",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device" />
    ),
    cell: ({ row }) => {
      const device: string = row.getValue("device");
      return <span>{device}</span>;
    },
  },

  {
    accessorKey: "error_message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Error Message" />
    ),
    cell: ({ row }) => {
      const error_message: string = row.getValue("error_message");
      return <span>{error_message}</span>;
    },
  },

  {
    accessorKey: "error_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Error Code" />
    ),
    cell: ({ row }) => {
      const error_code: string = row.getValue("error_code");
      return <span>{error_code}</span>;
    },
  },

  {
    accessorKey: "accessed_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accessed at" />
    ),
    cell: ({ row }) => {
      const accessed_at: string = row.getValue("accessed_at");
      return <LocalDateTime date={accessed_at} />;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const router = useRouter();
      const locale = useLocale();

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
                    router.push(`/${locale}/studio/error-logs/${id}`)
                  }
                >
                  <Eye />
                  Preview
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
