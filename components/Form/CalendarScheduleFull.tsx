"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";

interface CalendarScheduleFullProps {
  selected?: Date;
  onChange: (date: Date) => void;
  dateBooked?: { scheduled_datetime: string }[] | null;
}

function utcToIndonesiaTime(utcDateStr: string): Date {
  const utcDate = new Date(utcDateStr);
  // Add 7 hours to convert from UTC to WIB
  return new Date(utcDate.getTime());
}

export default function CalendarScheduleFull({
  selected,
  onChange,
  dateBooked,
}: CalendarScheduleFullProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // internal state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // generate time slots from 08:00 — 16:00 (30 min interval)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const totalMinutes = i * 30;
    const hour = Math.floor(totalMinutes / 60) + 8;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  useEffect(() => {
    console.log("dateBooked received:", dateBooked);
  }, [dateBooked]);

  const bookedDateTimes = useMemo(() => {
    if (!dateBooked || dateBooked.length === 0) return [];
    const result = dateBooked.map((item) =>
      utcToIndonesiaTime(item.scheduled_datetime)
    );
    console.log("bookedDateTimes (converted to WIB):", result);
    return result;
  }, [dateBooked]);

  const bookedTimeSlotsForSelectedDate = useMemo(() => {
    if (!selectedDate || bookedDateTimes.length === 0) return new Set<string>();

    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const bookedTimes = new Set<string>();

    bookedDateTimes.forEach((bookedDateTime) => {
      const bookedDateOnly = new Date(
        bookedDateTime.getFullYear(),
        bookedDateTime.getMonth(),
        bookedDateTime.getDate()
      );

      // Check if the booked date matches selected date
      if (bookedDateOnly.getTime() === selectedDateOnly.getTime()) {
        const h = bookedDateTime.getHours().toString().padStart(2, "0");
        const m = bookedDateTime.getMinutes().toString().padStart(2, "0");
        bookedTimes.add(`${h}:${m}`);
      }
    });

    console.log("selectedDate:", selectedDate);
    console.log("bookedTimeSlotsForSelectedDate:", Array.from(bookedTimes));

    return bookedTimes;
  }, [selectedDate, bookedDateTimes]);

  const fullyBookedDates = useMemo(() => {
    if (bookedDateTimes.length === 0) return [];

    // Group bookings by date
    const bookingsByDate = new Map<string, number>();

    bookedDateTimes.forEach((bookedDateTime) => {
      const dateKey = `${bookedDateTime.getFullYear()}-${bookedDateTime.getMonth()}-${bookedDateTime.getDate()}`;
      bookingsByDate.set(dateKey, (bookingsByDate.get(dateKey) || 0) + 1);
    });

    // Return dates that have all time slots booked
    const fullyBooked: Date[] = [];
    bookingsByDate.forEach((count, dateKey) => {
      if (count >= timeSlots.length) {
        const [year, month, day] = dateKey.split("-").map(Number);
        fullyBooked.push(new Date(year, month, day));
      }
    });

    return fullyBooked;
  }, [bookedDateTimes, timeSlots.length]);

  const disabledMatcher = (date: Date) => {
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Disable past dates
    if (dateOnly < today) return true;

    // Disable fully booked dates
    return fullyBookedDates.some(
      (bookedDate) =>
        bookedDate.getFullYear() === dateOnly.getFullYear() &&
        bookedDate.getMonth() === dateOnly.getMonth() &&
        bookedDate.getDate() === dateOnly.getDate()
    );
  };

  /** Disable past time for today only OR already booked time slots */
  const isTimeDisabled = (timeStr: string): boolean => {
    const isBooked = bookedTimeSlotsForSelectedDate.has(timeStr);

    if (isBooked) {
      console.log("Time slot disabled (booked):", timeStr);
    }

    if (isBooked) {
      return true;
    }

    if (!selectedDate) return false;

    const pickedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    // Check if selected date is today
    if (pickedDay.getTime() !== today.getTime()) return false;

    const [h, m] = timeStr.split(":").map(Number);
    const slot = new Date(today);
    slot.setHours(h, m, 0, 0);

    return slot <= now;
  };

  /** When a user selects a date */
  function handleDateChange(date: Date | undefined) {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes

    if (!date) return;

    // Find first available time slot
    const finalDate = new Date(date);
    const firstAvailableTime = timeSlots.find((time) => {
      // Temporarily set selectedDate for checking
      const tempSelectedDate = date;
      const pickedDay = new Date(
        tempSelectedDate.getFullYear(),
        tempSelectedDate.getMonth(),
        tempSelectedDate.getDate()
      );

      // Check if booked
      const isBooked = bookedDateTimes.some((bookedDateTime) => {
        const bookedDateOnly = new Date(
          bookedDateTime.getFullYear(),
          bookedDateTime.getMonth(),
          bookedDateTime.getDate()
        );
        if (bookedDateOnly.getTime() !== pickedDay.getTime()) return false;
        const h = bookedDateTime.getHours().toString().padStart(2, "0");
        const m = bookedDateTime.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}` === time;
      });

      if (isBooked) return false;

      // Check if past time (for today)
      if (pickedDay.getTime() === today.getTime()) {
        const [h, m] = time.split(":").map(Number);
        const slot = new Date(today);
        slot.setHours(h, m, 0, 0);
        if (slot <= now) return false;
      }

      return true;
    });

    if (firstAvailableTime) {
      const [h, m] = firstAvailableTime.split(":").map(Number);
      finalDate.setHours(h, m, 0, 0);
      setSelectedTime(firstAvailableTime);
    } else {
      finalDate.setHours(8, 0, 0, 0);
    }

    onChange(finalDate);
  }

  /** When a user selects a time */
  function handleTimeSelect(time: string) {
    setSelectedTime(time);

    if (!selectedDate) return;

    const [h, m] = time.split(":").map(Number);

    const final = new Date(selectedDate);
    final.setHours(h, m, 0, 0);

    onChange(final);
  }

  /** Sync external selected → local state */
  useEffect(() => {
    if (!selected) return;
    setSelectedDate(selected);

    const h = selected.getHours().toString().padStart(2, "0");
    const m = selected.getMinutes().toString().padStart(2, "0");
    setSelectedTime(`${h}:${m}`);
  }, [selected]);

  const partiallyBookedDates = useMemo(() => {
    if (bookedDateTimes.length === 0) return [];

    const uniqueDates = new Map<string, Date>();
    bookedDateTimes.forEach((bookedDateTime) => {
      const dateKey = `${bookedDateTime.getFullYear()}-${bookedDateTime.getMonth()}-${bookedDateTime.getDate()}`;
      if (!uniqueDates.has(dateKey)) {
        uniqueDates.set(
          dateKey,
          new Date(
            bookedDateTime.getFullYear(),
            bookedDateTime.getMonth(),
            bookedDateTime.getDate()
          )
        );
      }
    });

    return Array.from(uniqueDates.values());
  }, [bookedDateTimes]);

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            defaultMonth={today}
            disabled={disabledMatcher}
            showOutsideDays={false}
            modifiers={{
              booked: fullyBookedDates,
              partiallyBooked: partiallyBookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-50",
              partiallyBooked:
                "[&>button]:underline [&>button]:decoration-dotted",
            }}
            className="bg-transparent p-0"
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString("en-US", { weekday: "short" }),
            }}
          />
        </div>

        <div className="hide-scroll inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => {
              const isBooked = bookedTimeSlotsForSelectedDate.has(time);
              return (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => handleTimeSelect(time)}
                  disabled={isTimeDisabled(time)}
                  className={`w-full rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBooked ? "line-through" : ""
                  }`}
                >
                  {time}
                  {/* {isBooked && <span className="ml-1 text-xs">(Booked)</span>} */}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t px-6 py-5 md:flex-row">
        <div className="text-sm">
          {selectedDate && selectedTime ? (
            <p>
              Your meeting is booked for <br />
              <span className="font-semibold">
                {selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                - {selectedTime} WIB
              </span>
            </p>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
