"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getConsultationSlot } from "@/lib/consult/get-consultation";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { Check, Clock, CalendarDays } from "lucide-react";

interface ConsultationSchedulePickerProps {
  selected?: Date;
  onChange: (date: Date) => void;
  locale?: string;
  mode?: "create" | "update";
  currentSchedule?: {
    date: string; // ISO string or YYYY-MM-DD
    time: string; // HH:mm format
  };
  excludeCurrentSlot?: boolean; // If true, don't disable the current slot in update mode
}

export default function ConsultationSchedulePicker({
  selected,
  onChange,
  locale = "id",
  mode = "create",
  currentSchedule,
  excludeCurrentSlot = true,
}: ConsultationSchedulePickerProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  // Parse initial date from currentSchedule if in update mode
  const getInitialDate = (): Date => {
    if (mode === "update" && currentSchedule?.date) {
      const parsedDate = new Date(currentSchedule.date);
      if (!isNaN(parsedDate.getTime())) {
        return new Date(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate(),
        );
      }
    }
    return selected || today;
  };

  // Parse initial time from currentSchedule if in update mode
  const getInitialTime = (): string | null => {
    if (mode === "update" && currentSchedule?.time) {
      return currentSchedule.time;
    }
    return null;
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    getInitialDate(),
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    getInitialTime(),
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Check if a time slot has passed (only for today)
  const isTimeSlotPassed = (slot: string, date: Date): boolean => {
    const isToday = date.toDateString() === today.toDateString();
    if (!isToday) return false;

    const [hours, minutes] = slot.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime < now;
  };

  // Check if a slot is booked (but allow current slot in update mode)
  const isSlotBooked = (slot: string, date: Date): boolean => {
    const isBooked = bookedSlots.includes(slot);

    // In update mode, don't disable the current schedule's slot
    if (
      mode === "update" &&
      excludeCurrentSlot &&
      currentSchedule?.time === slot
    ) {
      // Check if it's the same date as current schedule
      if (currentSchedule?.date) {
        const currentDate = new Date(currentSchedule.date);
        const isSameDate =
          date.getFullYear() === currentDate.getFullYear() &&
          date.getMonth() === currentDate.getMonth() &&
          date.getDate() === currentDate.getDate();

        if (isSameDate) {
          return false; // Allow selecting the current slot
        }
      }
    }

    return isBooked;
  };

  // Check if slot is disabled (passed or booked)
  const isSlotDisabled = (slot: string, date: Date): boolean => {
    return isTimeSlotPassed(slot, date) || isSlotBooked(slot, date);
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch available slots when date is selected
  const fetchAvailableSlots = async (date: Date, preserveTime?: string) => {
    setLoadingSlots(true);
    setShowTimeSlots(false);

    // Only reset time if not preserving
    if (!preserveTime) {
      setSelectedTime(null);
    }

    try {
      const formattedDate = formatDate(date);
      const response = await getConsultationSlot(formattedDate);

      if (response.success && response.data) {
        setAvailableSlots(response.data.all_slots || []);
        setBookedSlots(response.data.booked_slots || []);
        setShowTimeSlots(true);

        // Restore time if preserving (for initial load in update mode)
        if (preserveTime) {
          setSelectedTime(preserveTime);
        }
      } else {
        console.error("Failed to fetch slots:", response.error);
        setAvailableSlots([]);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch slots on mount
  useEffect(() => {
    const initialDate = getInitialDate();
    const initialTime = getInitialTime();

    setSelectedDate(initialDate);
    fetchAvailableSlots(initialDate, initialTime || undefined);
  }, []);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    fetchAvailableSlots(date);
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;

    setSelectedTime(time);

    // Combine date and time
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(hours, minutes, 0, 0);

    onChange(combinedDateTime);
  };

  // Disable dates that are in the past or beyond 30 days
  const disabledDates = (date: Date) => {
    return date < today || date > maxDate;
  };

  // Check if current selection matches current schedule (for update mode)
  const isCurrentSchedule = (slot: string, date: Date): boolean => {
    if (mode !== "update" || !currentSchedule) return false;

    const currentDate = new Date(currentSchedule.date);
    const isSameDate =
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() === currentDate.getDate();

    return isSameDate && currentSchedule.time === slot;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Current Schedule Info (Update Mode) */}
        {mode === "update" && currentSchedule && (
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
              <CalendarDays className="size-4" />
              {locale === "id" ? "Jadwal Saat Ini:" : "Current Schedule:"}
            </p>
            <p className="text-base font-bold text-amber-800 dark:text-amber-300">
              {new Date(currentSchedule.date).toLocaleDateString(
                locale === "id" ? "id-ID" : "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}{" "}
              - {currentSchedule.time}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
              {locale === "id"
                ? "Pilih tanggal dan waktu baru untuk mengubah jadwal"
                : "Select a new date and time to change the schedule"}
            </p>
          </div>
        )}

        {/* Step 1: Date Selection */}
        <div>
          <h6 className="text-lg font-semibold text-primary mb-4">
            {locale === "id" ? "1. Pilih Tanggal" : "1. Select Date"}
          </h6>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            className="rounded-md border w-full"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {locale === "id"
              ? "Tanggal yang dapat dipilih: Hari ini hingga 30 hari ke depan"
              : "Available dates: Today up to 30 days ahead"}
          </p>
        </div>

        {/* Step 2: Time Selection */}
        {selectedDate && (
          <div>
            <h6 className="text-lg font-semibold text-primary mb-4">
              {locale === "id" ? "2. Pilih Waktu" : "2. Select Time"}
            </h6>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
                <span className="ml-2 text-muted-foreground">
                  {locale === "id"
                    ? "Memuat slot waktu..."
                    : "Loading time slots..."}
                </span>
              </div>
            ) : showTimeSlots ? (
              <>
                {availableSlots.length === 0 ? (
                  <div className="text-center py-8 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      {locale === "id"
                        ? "Tidak ada slot waktu tersedia untuk tanggal ini"
                        : "No time slots available for this date"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {availableSlots.map((slot) => {
                        const isPassed = isTimeSlotPassed(slot, selectedDate);
                        const isBooked = isSlotBooked(slot, selectedDate);
                        const isDisabled = isSlotDisabled(slot, selectedDate);
                        const isCurrent = isCurrentSchedule(slot, selectedDate);
                        const isSelected = selectedTime === slot;

                        return (
                          <Button
                            key={slot}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            disabled={isDisabled}
                            className={cn(
                              "h-12 relative",
                              isSelected && "ring-2 ring-primary ring-offset-2",
                              isPassed &&
                                "opacity-50 cursor-not-allowed line-through",
                              isBooked &&
                                !isCurrent &&
                                "opacity-50 cursor-not-allowed bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-400",
                              isCurrent &&
                                !isSelected &&
                                "border-amber-400 bg-amber-50 dark:bg-amber-950/30",
                            )}
                            onClick={() => handleTimeSelect(slot)}
                          >
                            {isSelected && !isDisabled && (
                              <Check className="absolute top-1 right-1 size-4" />
                            )}
                            {isCurrent && !isSelected && (
                              <Clock className="absolute top-1 right-1 size-3 text-amber-500" />
                            )}
                            {slot}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border bg-red-50 dark:bg-red-950/30 border-red-200"></div>
                        <span>
                          {locale === "id"
                            ? "Sudah dibooking"
                            : "Already booked"}
                        </span>
                      </div>
                      {mode === "update" && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border bg-amber-50 dark:bg-amber-950/30 border-amber-400"></div>
                          <span>
                            {locale === "id"
                              ? "Jadwal saat ini"
                              : "Current schedule"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border line-through opacity-50"></div>
                        <span>
                          {locale === "id" ? "Waktu berlalu" : "Time passed"}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {bookedSlots.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    {locale === "id"
                      ? `${bookedSlots.length} slot sudah dibooking`
                      : `${bookedSlots.length} slots already booked`}
                  </p>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <div className="bg-primary/10 p-4 rounded-lg border border-primary">
            <p className="text-sm font-semibold text-primary mb-1">
              {mode === "update"
                ? locale === "id"
                  ? "Jadwal Baru:"
                  : "New Schedule:"
                : locale === "id"
                  ? "Jadwal Terpilih:"
                  : "Selected Schedule:"}
            </p>
            <p className="text-base font-bold text-primary">
              {selectedDate.toLocaleDateString(
                locale === "id" ? "id-ID" : "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}{" "}
              - {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
