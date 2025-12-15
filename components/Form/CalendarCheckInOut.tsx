"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CalendarCheckInOutProps = {
  startDate?: Date;
  endDate?: Date;
  onChangeStart: (date: Date) => void;
  onChangeEnd: (date: Date) => void;
};

function mergeDateTime(date: Date, time: string) {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, seconds || 0, 0);
  return newDate;
}

export function CalendarCheckInOut({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: CalendarCheckInOutProps) {
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();

  const [timeFrom, setTimeFrom] = React.useState(`${hours}:${minutes}:00`);
  const [timeTo, setTimeTo] = React.useState(`${hours}:${minutes}:00`);

  return (
    <div className="flex flex-col gap-4">
      {/* CHECK IN */}
      <div>
        <p className="text-sm! text-primary mb-1">Start Date</p>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <Popover open={openFrom} onOpenChange={setOpenFrom}>
              <PopoverTrigger asChild>
                <Button className="justify-between font-normal h-12 border bg-white text-primary hover:bg-white hover:border-primary focus:border-primary">
                  {startDate
                    ? startDate.toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (!date) return;
                    onChangeStart(mergeDateTime(date, timeFrom));
                    setOpenFrom(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Input
            type="time"
            step="1"
            className="h-12"
            value={timeFrom}
            onChange={(e) => {
              setTimeFrom(e.target.value);
              if (startDate) {
                onChangeStart(mergeDateTime(startDate, e.target.value));
              }
            }}
          />
        </div>
      </div>

      {/* CHECK OUT */}
      <div>
        <p className="text-sm! text-primary mb-1">End Date</p>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <Popover open={openTo} onOpenChange={setOpenTo}>
              <PopoverTrigger asChild>
                <Button className="justify-between font-normal h-12 border bg-white text-primary hover:bg-white hover:border-primary focus:border-primary">
                  {endDate
                    ? endDate.toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  disabled={startDate && { before: startDate }}
                  onSelect={(date) => {
                    if (!date) return;
                    onChangeEnd(mergeDateTime(date, timeTo));
                    setOpenTo(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Input
            type="time"
            step="1"
            className="h-12"
            value={timeTo}
            onChange={(e) => {
              setTimeTo(e.target.value);
              if (endDate) {
                onChangeEnd(mergeDateTime(endDate, e.target.value));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
