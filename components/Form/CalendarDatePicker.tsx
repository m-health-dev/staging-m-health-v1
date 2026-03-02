"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CalendarDatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (value: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3 font-sans!">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            id="date"
            className="flex items-center border rounded-2xl h-12 px-2 w-full justify-between font-normal bg-white"
          >
            {value ? (
              dayjs(value).format("DD MMMM YYYY")
            ) : (
              "Select date"
            )}
            <ChevronDownIcon className="size-5" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
