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

import { UsersType } from "@/types/account.types";
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

export const columns: ColumnDef<UsersType>[] = [
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
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Version" />
    ),
    cell: ({ row }) => {
      const version: string = row.getValue("version");
      return <span>{version}</span>;
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
      const version: string = row.getValue("version");

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
                    router.push(`/${locale}/terms/${id}?v=${version}`)
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
