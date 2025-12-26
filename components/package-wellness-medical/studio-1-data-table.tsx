"use client";
import React, { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, ListFilter } from "lucide-react";

import LocalDateTime from "@/components/utility/lang/LocaleDateTime";

import { useLocale } from "next-intl";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import LoadingTableCard from "../utility/loading/loading-table-card";
import SimplePagination from "../utility/simple-pagination";
import StatusBadge from "../utility/status-badge";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: any;
  links: any;
  locale: string;
  type?:
    | "chat-activity"
    | "vendor"
    | "hotel"
    | "packages"
    | "events"
    | "default";
  deleteAction?: (id: string) => Promise<{ error?: string }>;
}

export function Studio1DataTable<TData, TValue>({
  columns,
  data,
  meta,
  links,
  locale,
  type = "default",
  deleteAction,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const params = useSearchParams();

  const [viewCard, setViewCard] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const { open } = useSidebar();

  React.useEffect(() => {
    const currentPerPage = Number(params.get("per_page"));
    if (currentPerPage && currentPerPage !== perPage) {
      setPerPage(currentPerPage);
      table.setPageSize(currentPerPage);
    }
    setLoading(false);
  }, [params]);

  React.useEffect(() => {
    const getPreviewMode = localStorage.getItem("preferred_std_preview_mode");
    if (getPreviewMode === "card") {
      setViewCard(true);
    } else {
      setViewCard(false);
    }
  }, []);

  const handlePreviewCard = () => {
    setViewCard(true);
    localStorage.setItem("preferred_std_preview_mode", "card");
  };

  const handlePreviewTable = () => {
    setViewCard(false);
    localStorage.setItem("preferred_std_preview_mode", "table");
  };

  const getPerPage = Number(params.get("per_page"));

  const [perPage, setPerPage] = React.useState(10);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const goToPage = (page: number, per_page: number = 10) => {
    setLoading(true);
    router.push(`?page=${page}&per_page=${per_page || perPage}`, {
      scroll: false,
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const now = new Date();

  return (
    <>
      {loading ? (
        <LoadingTableCard count={perPage} card={viewCard} />
      ) : (
        <>
          <div className="flex lg:flex-row flex-col lg:items-center items-end justify-center lg:justify-between pb-4 gap-4">
            <Input
              placeholder="Filter by Name"
              value={
                (table.getColumn("id_title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("id_title")?.setFilterValue(event.target.value)
              }
              className="lg:max-w-sm w-full h-12"
            />
            <div className="flex flex-row gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="ml-auto rounded-2xl bg-white shadow-sm"
                  >
                    {viewCard ? (
                      <LayoutGrid />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-table-icon lucide-table"
                      >
                        <path d="M12 3v18" />
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                      </svg>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    className="capitalize"
                    checked={!viewCard}
                    onCheckedChange={handlePreviewTable}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-table-icon lucide-table"
                    >
                      <path d="M12 3v18" />
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M3 15h18" />
                    </svg>{" "}
                    Table
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuCheckboxItem
                    className="capitalize"
                    checked={viewCard}
                    onCheckedChange={handlePreviewCard}
                  >
                    <LayoutGrid /> Card
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!viewCard && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="ml-auto rounded-2xl bg-white shadow-sm"
                    >
                      <ListFilter />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {viewCard && (
            <div className="md:grid flex flex-col lg:grid-cols-3 md:grid-cols-2 gap-4">
              {table.getFilteredRowModel().rows.length ? (
                table.getFilteredRowModel().rows.map((row) => {
                  const actionCell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === "actions");

                  return (
                    // <RowContextMenu
                    //   key={row.id}
                    //   row={row}
                    //   locale={locale}
                    //   deleteAction={deleteAction}
                    //   resourceType={resourceType}
                    //   router={router}
                    // >
                    <div
                      key={row.id}
                      className="rounded-xl border p-4  bg-white relative"
                    >
                      <div className="flex flex-col gap-3 items-start relative">
                        {actionCell && (
                          <div className="absolute top-1 right-1 z-10">
                            {flexRender(
                              actionCell.column.columnDef.cell,
                              actionCell.getContext()
                            )}
                          </div>
                        )}
                        <div>
                          <div className="mb-2">
                            {new Date(
                              row.getValue("created_at")
                            ).getFullYear() === now.getFullYear() &&
                              new Date(
                                row.getValue("created_at")
                              ).getMonth() === now.getMonth() &&
                              new Date(row.getValue("created_at")).getDate() ===
                                now.getDate() && (
                                <p className="bg-health px-1.5 py-0.5 rounded-lg text-white text-xs! inline-flex w-fit">
                                  New
                                </p>
                              )}
                          </div>
                          <p className="text-sm! text-muted-foreground uppercase mb-5">
                            {String(row.getValue("id")).slice(0, 8)}
                          </p>
                          <h5 className="font-semibold text-primary text-lg">
                            {row.getValue("id_title")}
                          </h5>
                          <p className="text-muted-foreground text-sm! mt-2">
                            {row.getValue("en_title")}
                          </p>
                          {type === "events" && (
                            <div className="inline-flex gap-2 items-center mt-3">
                              <Image
                                src={row.getValue("organized_image")}
                                alt={row.getValue("organized_by")}
                                width={100}
                                height={100}
                                className={
                                  "w-7 h-7 object-center object-cover aspect-square rounded-full"
                                }
                              />
                              <p className="text-sm!">
                                {row.getValue("organized_by")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 mt-3">
                        <div>
                          <p className="text-xs! text-muted-foreground">
                            Created at
                          </p>
                          <p className="text-sm!">
                            <LocalDateTime date={row.getValue("created_at")} />
                          </p>
                        </div>
                        <div>
                          <p className="text-xs! text-muted-foreground">
                            Updated at
                          </p>
                          <p className="text-sm!">
                            <LocalDateTime date={row.getValue("updated_at")} />
                          </p>
                        </div>
                        <div className="flex justify-end mt-2 absolute bottom-4 right-4">
                          <StatusBadge status={row.getValue("status")} />
                        </div>
                      </div>
                    </div>
                    // </RowContextMenu>
                  );
                })
              ) : (
                <div className="h-24 text-center col-span-3 bg-white border rounded-2xl flex justify-center items-center">
                  <p className="text-muted-foreground">No results.</p>
                </div>
              )}
            </div>
          )}
          {!viewCard && (
            <div
              className={cn(
                "overflow-hidden rounded-md border bg-white",
                open ? "2xl:min-w-full 2xl:max-w-full max-w-6xl" : "w-full"
              )}
            >
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="bg-muted">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            <p className="text-sm!">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </p>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
      <SimplePagination
        meta={meta}
        links={links}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
    </>
  );
}
