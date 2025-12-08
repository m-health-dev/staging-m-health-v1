import { cn } from "@/lib/utils";
import { Archive, Eye, StickyNote } from "lucide-react";
import React from "react";

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        "inline-flex justify-center items-center w-fit px-3 py-1 capitalize rounded-full text-sm!",
        status === "draft" && "bg-blue-50 text-blue-500 border border-blue-300",
        status === "published" &&
          "bg-green-50 text-green-500 border border-green-300",
        status === "archived" &&
          "bg-amber-50 text-amber-500 border border-amber-300"
      )}
    >
      {status === "draft" && <StickyNote className="size-4 mr-1" />}{" "}
      {status === "published" && <Eye className="size-4 mr-1" />}
      {status === "archived" && <Archive className="size-4 mr-1" />} {status}
    </span>
  );
};

export default StatusBadge;
