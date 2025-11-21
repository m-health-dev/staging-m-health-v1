"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Calendar20Props {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  selectedTime?: string | null;
  onTimeChange: (time: string) => void;
}

export default function CalendarSchedule({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
}: Calendar20Props) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  const bookedDates = Array.from(
    { length: 3 },
    (_, i) => new Date(2025, 5, 17 + i)
  );

  const disabledDates = bookedDates.concat([
    // Add all dates before today
    ...Array.from({ length: 365 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i - 1);
      return date;
    }),
  ]);

  const isTimePast = (timeStr: string): boolean => {
    if (!selectedDate) return false;

    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    if (selectedDateOnly.getTime() !== today.getTime()) {
      return false; // Only disable past times for today
    }

    const [hour, minute] = timeStr.split(":").map(Number);
    const slotTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
    return slotTime <= now;
  };

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            defaultMonth={today}
            disabled={disabledDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("en-US", { weekday: "short" });
              },
            }}
          />
        </div>

        <div className="hide-scroll inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeChange(time)}
                disabled={isTimePast(time)}
                className="w-full shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-500 rounded-xl text-sm! md:text-base!"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t px-6 py-5! md:flex-row">
        <div className="text-sm">
          {selectedDate && selectedTime ? (
            <>
              Your meeting is booked for{" "}
              <span className="font-medium">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>{" "}
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>

        <Button
          disabled={!selectedDate || !selectedTime}
          className="w-full md:ml-auto md:w-auto bg-transparent"
          variant="outline"
          type="button"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
