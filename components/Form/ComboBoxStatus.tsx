"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

const options = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function ComboBoxStatus() {
  const form = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="text-primary font-semibold!">Status</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-between w-full border border-input bg-white text-muted-foreground text-base! rounded-2xl px-3! h-12 font-normal hover:bg-white hover:text-foreground hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary",
                  field.value === "draft" &&
                    "text-primary font-semibold hover:text-primary bg-blue-50",
                  field.value === "archived" &&
                    "text-amber-500 font-semibold hover:text-amber-500 bg-amber-50",
                  field.value === "published" &&
                    "text-green-600 font-semibold hover:text-green-600 bg-green-50"
                )}
              >
                {field.value
                  ? options.find((o) => o.value === field.value)?.label
                  : "Pilih Status"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 min-w-md max-w-full">
              <Command>
                <CommandInput placeholder="Cari Status..." />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                <CommandGroup className="p-2">
                  {options.map((o) => (
                    <CommandItem
                      key={o.value}
                      value={o.value}
                      className={cn(
                        "font-sans mb-2 rounded-lg",
                        o.value === "draft" &&
                          "bg-blue-50! text-blue-500! hover:bg-blue-100! hover:ring ring-inset hover:ring-blue-500",
                        o.value === "published" &&
                          "bg-green-50! text-green-500! hover:bg-green-100! hover:ring ring-inset hover:ring-green-500",
                        o.value === "archived" &&
                          "bg-amber-50! text-amber-500! hover:bg-amber-100! hover:ring ring-inset hover:ring-amber-500"
                      )}
                      onSelect={() => {
                        form.setValue("status", o.value);
                        setOpen(false);
                      }}
                    >
                      {o.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
