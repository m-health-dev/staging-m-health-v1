"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

type CalendarCheckInOutProps = {
  startDate?: Date;
  endDate?: Date;
  onChangeStart: (date: Date) => void;
  onChangeEnd: (date: Date) => void;
};

function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function CalendarCheckInOut({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: CalendarCheckInOutProps) {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
      {/* START DATE */}
      <div>
        <p className="text-sm! text-primary mb-1">Start Date</p>
        <Input
          type="datetime-local"
          className="h-12 text-primary"
          value={
            startDate && !isNaN(startDate.getTime())
              ? toDatetimeLocalString(startDate)
              : ""
          }
          onChange={(e) => {
            if (!e.target.value) return;
            const date = new Date(e.target.value);
            if (!isNaN(date.getTime())) {
              onChangeStart(date);
            }
          }}
        />
      </div>

      {/* END DATE */}
      <div>
        <p className="text-sm! text-primary mb-1">End Date</p>
        <Input
          type="datetime-local"
          className="h-12 text-primary"
          min={
            startDate && !isNaN(startDate.getTime())
              ? toDatetimeLocalString(startDate)
              : undefined
          }
          value={
            endDate && !isNaN(endDate.getTime())
              ? toDatetimeLocalString(endDate)
              : ""
          }
          onChange={(e) => {
            if (!e.target.value) return;
            const date = new Date(e.target.value);
            if (!isNaN(date.getTime())) {
              onChangeEnd(date);
            }
          }}
        />
      </div>
    </div>
  );
}
