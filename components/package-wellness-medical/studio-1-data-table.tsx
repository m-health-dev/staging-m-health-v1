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
import Avatar from "boring-avatars";

import { nanoid } from "nanoid";
import { Skeleton } from "../ui/skeleton";
import { routing } from "@/i18n/routing";
import { formatRupiah } from "@/helper/rupiah";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[] | null | undefined;
  data: TData[] | null | undefined;
  meta?: any;
  links?: any;
  locale: string;
  type?:
    | "chat-activity"
    | "vendor"
    | "hotel"
    | "packages"
    | "events"
    | "users"
    | "article-category"
    | "authors"
    | "hero"
    | "legal"
    | "consult-schedule"
    | "payment-records"
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

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  const [viewCard, setViewCard] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // console.log("Data Received in Table:", data);

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

  const [loadingHero, setLoadingHero] = useState(true);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const goToPage = (page: number, per_page: number = 10) => {
    setLoading(true);
    router.push(`?page=${page}&per_page=${per_page || perPage}`, {
      scroll: false,
    });
  };

  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
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
  const filteredRows = table?.getFilteredRowModel()?.rows ?? [];

  console.log("columns:", columns);
  console.log("safeColumns:", safeColumns);
  console.log("data:", data);

  return (
    <>
      {loading ? (
        <LoadingTableCard count={perPage} card={viewCard} />
      ) : (
        <>
          <div className="flex lg:flex-row flex-col lg:items-center items-end justify-center lg:justify-between pb-4 gap-4">
            {type !== "legal" && (
              <Input
                placeholder="Filter by Name"
                value={
                  (table
                    .getColumn(
                      `${
                        type === "users"
                          ? "fullname"
                          : type === "authors"
                          ? "name"
                          : type === "article-category"
                          ? "id_category"
                          : type === "hero"
                          ? "title"
                          : type === "consult-schedule"
                          ? "fullname"
                          : type === "payment-records"
                          ? "transaction_id"
                          : "id_title"
                      }`
                    )
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(
                      `${
                        type === "users"
                          ? "fullname"
                          : type === "authors"
                          ? "name"
                          : type === "article-category"
                          ? "id_category"
                          : type === "hero"
                          ? "title"
                          : type === "consult-schedule"
                          ? "fullname"
                          : type === "payment-records"
                          ? "transaction_id"
                          : "id_title"
                      }`
                    )
                    ?.setFilterValue(event.target.value)
                }
                className="lg:max-w-sm w-full h-12"
              />
            )}

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
                        const id = nanoid();
                        return (
                          <DropdownMenuCheckboxItem
                            key={id}
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
              {filteredRows.length ? (
                filteredRows.map((row) => {
                  const actionCell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === "actions");

                  const id = nanoid();

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
                      key={id}
                      className="rounded-xl border p-4  bg-white relative w-full"
                    >
                      <div className="flex flex-col gap-3 items-start relative w-full">
                        {actionCell && (
                          <div className="absolute top-1 right-1 z-10">
                            {flexRender(
                              actionCell.column.columnDef.cell,
                              actionCell.getContext()
                            )}
                          </div>
                        )}
                        <div>
                          {type === "users" && (
                            <div className="inline-flex gap-2 items-center mb-3">
                              {!row.getValue("avatar_url") ? (
                                <Avatar
                                  name={String(
                                    row.getValue("fullname") || "User"
                                  )}
                                  className="w-20! h-20! border rounded-full"
                                  colors={[
                                    "#3e77ab",
                                    "#22b26e",
                                    "#f2f26f",
                                    "#fff7bd",
                                    "#95cfb7",
                                  ]}
                                  variant="beam"
                                  size={20}
                                />
                              ) : (
                                <Image
                                  src={row.getValue("avatar_url")}
                                  alt={row.getValue("fullname")}
                                  width={100}
                                  height={100}
                                  className={
                                    "w-20 h-20 object-center object-cover aspect-square rounded-full"
                                  }
                                />
                              )}
                            </div>
                          )}

                          {type === "authors" && (
                            <div className="inline-flex gap-2 items-center mb-3">
                              {!row.getValue("profile_image") ? (
                                <Avatar
                                  name={String(
                                    row.getValue("name") || "Author"
                                  )}
                                  className="w-20! h-20! border rounded-full"
                                  colors={[
                                    "#3e77ab",
                                    "#22b26e",
                                    "#f2f26f",
                                    "#fff7bd",
                                    "#95cfb7",
                                  ]}
                                  variant="beam"
                                  size={20}
                                />
                              ) : (
                                <Image
                                  src={row.getValue("profile_image")}
                                  alt={row.getValue("name")}
                                  width={100}
                                  height={100}
                                  className={
                                    "w-20 h-20 object-center object-cover aspect-square rounded-full"
                                  }
                                />
                              )}
                            </div>
                          )}

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

                          {type === "legal" ? (
                            <h5 className="font-semibold text-primary text-lg">
                              {row.getValue("version")}
                            </h5>
                          ) : (
                            type !== "users" &&
                            type !== "authors" &&
                            type !== "article-category" &&
                            type !== "hero" &&
                            type !== "consult-schedule" &&
                            type !== "payment-records" && (
                              <p className="text-muted-foreground text-sm! mt-2">
                                {row.getValue("en_title")}
                              </p>
                            )
                          )}
                          <h5 className="font-semibold text-primary text-lg">
                            {row.getValue(
                              `${
                                type === "users"
                                  ? "fullname"
                                  : type === "authors"
                                  ? "name"
                                  : type === "article-category"
                                  ? "id_category"
                                  : type === "hero"
                                  ? "title"
                                  : type === "consult-schedule"
                                  ? "fullname"
                                  : type === "payment-records"
                                  ? "fullname"
                                  : "id_title"
                              }`
                            )}
                          </h5>

                          {type === "payment-records" && (
                            <div className="flex flex-col w-full">
                              <div className="flex items-center mb-5 mt-5">
                                <div className="flex items-center gap-2">
                                  <p className="bg-gray-50 text-gray-700 border border-gray-500 px-3 py-1 rounded-full capitalize">
                                    {row.getValue("payment_status")}
                                  </p>
                                </div>
                              </div>
                              <p className="text-health text-sm! w-full">
                                {row.getValue("transaction_id")}
                              </p>
                              <h5 className="text-primary font-semibold mb-4 w-full">
                                {row.getValue("product_name")}
                              </h5>

                              <div className="mb-5 border-l-4 border-l-primary bg-blue-50 p-4 flex flex-col w-full">
                                <p className="text-sm! text-muted-foreground">
                                  {locale === routing.defaultLocale
                                    ? "Total Pembayaran"
                                    : "Total Payment"}
                                </p>
                                <h6 className="text-primary font-bold">
                                  {formatRupiah(row.getValue("payment_total"))}
                                </h6>
                              </div>
                            </div>
                          )}
                          {type === "consult-schedule" && (
                            <>
                              <p className="text-muted-foreground text-sm! mt-0">
                                {row.getValue("email")}
                              </p>
                              <p className="text-health text-sm! mt-0">
                                {row.getValue("phone_number")}
                              </p>
                              <div className="border-l-4 border-l-primary px-4 bg-blue-50 mt-3 py-4">
                                <p>
                                  <LocalDateTime
                                    date={row.getValue("scheduled_datetime")}
                                  />
                                </p>
                              </div>
                            </>
                          )}

                          {type === "article-category" && (
                            <p className="text-muted-foreground text-sm! mt-2">
                              {row.getValue("en_category")}
                            </p>
                          )}

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
                      <div className="space-y-2 mt-3 w-full">
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
                        {type !== "users" &&
                          type !== "authors" &&
                          type !== "article-category" &&
                          type !== "hero" &&
                          type !== "consult-schedule" && (
                            <div className="flex justify-end mt-2 absolute bottom-4 right-4">
                              <StatusBadge status={row.getValue("status")} />
                            </div>
                          )}
                        {type === "hero" && (
                          <div className="relative w-full h-auto mt-5 aspect-20/7">
                            {loadingHero && (
                              <Skeleton className="absolute inset-0 w-full h-auto aspect-20/7 rounded-2xl" />
                            )}

                            <Image
                              src={row.getValue("image")}
                              alt={row.getValue("title")}
                              fill
                              onLoadingComplete={() => setLoadingHero(false)}
                              className="object-cover object-center rounded-2xl"
                            />
                          </div>
                        )}
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
                        const id = nanoid();
                        return (
                          <TableHead key={id} className="bg-muted">
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
                  {filteredRows.length ? (
                    filteredRows.map((row) => (
                      <TableRow
                        key={nanoid()}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={nanoid()}>
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
                        colSpan={safeColumns.length}
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
