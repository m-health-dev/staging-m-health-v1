"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const SimplePagination = ({
  links,
  meta,
  show,
  defaultPerPage,
  onLoadingChange,
}: {
  links: any;
  meta: any;
  show: any[];
  defaultPerPage: number;
  onLoadingChange: (loading: boolean) => void;
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const [loading, setLoading] = React.useState(false);
  const [perPage, setPerPage] = React.useState(defaultPerPage);
  const [pageInput, setPageInput] = React.useState(`${meta.current_page}`);

  React.useEffect(() => {
    const currentPerPage = Number(params.get("per_page"));
    if (currentPerPage && currentPerPage !== perPage) {
      setPerPage(currentPerPage);
    }

    // Sinkronkan input ketika halaman berubah (misal via tombol next/prev)
    setPageInput(`${meta.current_page}`);

    setLoading(false);
    onLoadingChange(false);
  }, [params, meta.current_page]);

  const goToPage = (page: number, per_page: number = defaultPerPage) => {
    setLoading(true);
    onLoadingChange(true);

    router.push(`?page=${page}&per_page=${per_page || perPage}`, {
      scroll: false,
    });
  };

  // ---- Debounce logic ----
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (pageInput === "") return;

      const num = Number(pageInput);
      if (Number.isNaN(num)) return;

      if (num >= 1 && num <= meta.last_page && num !== meta.current_page) {
        goToPage(num, perPage);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [pageInput]);

  return (
    <div className="mt-3 flex w-full justify-center">
      <div className="flex lg:flex-row flex-col gap-3 items-center mt-6">
        {/* Per Page Dropdown */}
        <Select
          value={`${perPage}`}
          onValueChange={(value) => {
            setPerPage(Number(value));
            goToPage(
              meta.current_page > meta.last_page
                ? meta.last_page
                : meta.current_page,
              Number(value)
            );
          }}
        >
          <SelectTrigger className="w-[100px] bg-white rounded-2xl h-12! font-sans">
            <SelectValue placeholder={perPage} />
          </SelectTrigger>
          <SelectContent side="top">
            {show.map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
                className="font-sans"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pagination Navigation */}
        <div className="flex gap-3 items-center">
          {/* Prev */}
          <button
            disabled={!links.prev}
            onClick={() => goToPage(meta.current_page - 1, perPage)}
            className="text-primary outline outline-primary rounded-2xl w-10 h-10 flex items-center bg-white justify-center hover:bg-primary hover:text-white transition-all duration-150 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>

          {/* Page Input */}
          <Input
            type="number"
            value={pageInput}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) {
                setPageInput(v);
              }
            }}
            className="w-12 text-center border rounded-2xl h-12 -mr-1"
          />

          <p>/ {meta.last_page}</p>

          {/* Next */}
          <button
            disabled={!links.next}
            onClick={() => goToPage(meta.current_page + 1, perPage)}
            className="text-primary outline outline-primary rounded-2xl w-10 h-10 flex items-center bg-white justify-center hover:bg-primary hover:text-white transition-all duration-150 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplePagination;
