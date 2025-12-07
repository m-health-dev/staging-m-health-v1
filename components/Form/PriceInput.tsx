"use client";

import { z } from "zod";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

export const formatRupiah = (value: string | number) => {
  const number = value.toString().replace(/[^0-9]/g, "");
  if (!number) return "Rp ";
  return "Rp " + number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const removeRupiahFormat = (value: string) =>
  value.replace(/Rp\s?/g, "").replace(/\./g, "");

type RupiahInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
};

export function RupiahInput({
  control,
  name,
  label,
  placeholder = "Rp 100.000",
}: RupiahInputProps) {
  const [displayValue, setDisplayValue] = useState("Rp ");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Sinkronkan saat initial value muncul dari form
        useEffect(() => {
          if (field.value) {
            setDisplayValue(formatRupiah(field.value));
          }
        }, [field.value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = removeRupiahFormat(e.target.value); // angka murni
          field.onChange(Number(raw || "0")); // simpan sebagai number
          setDisplayValue(formatRupiah(raw)); // tampilkan Rp ...
        };

        return (
          <FormItem>
            <FormLabel className="text-primary font-semibold">
              {label}
            </FormLabel>
            <FormControl>
              <Input
                value={displayValue}
                onChange={handleChange}
                inputMode="numeric"
                type="text"
                placeholder={placeholder}
                className="h-12"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
