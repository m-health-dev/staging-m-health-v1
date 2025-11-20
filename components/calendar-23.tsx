"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";

export function CalendarRangeField({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
}) {
  const bookedDates = Array.from(
    { length: 12 },
    (_, i) => new Date(2025, 10, 10 + i)
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-input bg-white hover:bg-muted hover:text-foreground"
        >
          {value?.from && value?.to
            ? `${dayjs(value.from).format("DD MMMM YYYY")} - ${dayjs(
                value.to
              ).format("DD MMMM YYYY")}`
            : "Select date range"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          disabled={bookedDates}
          excludeDisabled
          max={3}
          min={3}
        />
      </PopoverContent>
    </Popover>
  );
}
