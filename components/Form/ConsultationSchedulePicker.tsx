"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getConsultationSlot } from "@/lib/consult/get-consultation";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ConsultationSchedulePickerProps {
  selected?: Date;
  onChange: (date: Date) => void;
  locale?: string;
}

export default function ConsultationSchedulePicker({
  selected,
  onChange,
  locale = "id",
}: ConsultationSchedulePickerProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30); // 30 hari dari sekarang

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selected || today
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch available slots when date is selected
  const fetchAvailableSlots = async (date: Date) => {
    setLoadingSlots(true);
    setShowTimeSlots(false);
    setSelectedTime(null);

    try {
      const formattedDate = formatDate(date);
      const response = await getConsultationSlot(formattedDate);

      if (response.success && response.data) {
        setAvailableSlots(response.data.available_slots || []);
        setBookedSlots(response.data.booked_slots || []);
        setShowTimeSlots(true);
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

  // Fetch slots for today on component mount
  useEffect(() => {
    const initialDate = selected || today;
    setSelectedDate(initialDate);
    fetchAvailableSlots(initialDate);
  }, []); // Only run once on mount

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

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
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
            // classNames={{
            //   months:
            //     "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            //   month: "space-y-4 w-full",
            //   //   caption: "flex justify-center pt-1 relative items-center",
            //   //   caption_label: "text-sm font-medium",
            //   nav: "space-x-1 flex items-center",
            //   nav_button:
            //     "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            //   //   nav_button_previous: "absolute left-1",
            //   //   nav_button_next: "absolute right-1",
            //   table: "w-full border-collapse space-y-1",
            //   head_row: "flex justify-around",
            //   head_cell:
            //     "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            //   row: "flex w-full mt-2 justify-around",
            //   cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            //   day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
            //   day_selected:
            //     "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            //   day_today: "bg-accent text-accent-foreground",
            //   day_outside: "text-muted-foreground opacity-50",
            //   day_disabled: "text-muted-foreground opacity-50 line-through",
            //   day_range_middle:
            //     "aria-selected:bg-accent aria-selected:text-accent-foreground",
            //   day_hidden: "invisible",
            // }}
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableSlots.map((slot) => {
                      const isPassed = isTimeSlotPassed(slot, selectedDate);
                      return (
                        <Button
                          key={slot}
                          type="button"
                          variant={
                            selectedTime === slot ? "default" : "outline"
                          }
                          disabled={isPassed}
                          className={cn(
                            "h-12 relative",
                            selectedTime === slot &&
                              "ring-2 ring-primary ring-offset-2",
                            isPassed &&
                              "opacity-50 cursor-not-allowed line-through"
                          )}
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {selectedTime === slot && !isPassed && (
                            <Check className="absolute top-1 right-1 size-4" />
                          )}
                          {slot}
                        </Button>
                      );
                    })}
                  </div>
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
              {locale === "id" ? "Jadwal Terpilih:" : "Selected Schedule:"}
            </p>
            <p className="text-base font-bold text-primary">
              {selectedDate.toLocaleDateString(
                locale === "id" ? "id-ID" : "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}{" "}
              - {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
