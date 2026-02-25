"use client";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { DataTableColumnHeader } from "@/components/utility/table/data-table-column-header";

import { ContactType } from "@/types/contact.types";
import { ColumnDef } from "@tanstack/react-table";

import {
  Check,
  Copy,
  Eye,
  MoreHorizontal,
  PenSquare,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";

import { useRouter } from "next/navigation";

export const columns: ColumnDef<ContactType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return <span>{name}</span>;
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email: string = row.getValue("email");
      return <span>{email}</span>;
    },
  },

  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => {
      const subject: string = row.getValue("subject");
      return <span>{subject}</span>;
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
                  onClick={() => router.push(`/${locale}/studio/contact/${id}`)}
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
