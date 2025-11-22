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
  { value: "option1", label: "Pilihan Satu" },
  { value: "option2", label: "Pilihan Dua" },
  { value: "option3", label: "Pilihan Tiga" },
];

export function ComboBoxField() {
  const form = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="text-primary font-semibold!">
            Kategori
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-between w-full border border-input bg-white text-muted-foreground text-base! rounded-2xl px-3! h-12 font-normal hover:bg-white hover:text-foreground hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary",
                  field.value && "text-primary font-semibold hover:text-primary"
                )}
              >
                {field.value
                  ? options.find((o) => o.value === field.value)?.label
                  : "Pilih kategori"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 min-w-md max-w-full">
              <Command>
                <CommandInput placeholder="Cari kategori..." />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                <CommandGroup>
                  {options.map((o) => (
                    <CommandItem
                      key={o.value}
                      value={o.value}
                      className="font-sans"
                      onSelect={() => {
                        form.setValue("category", o.value);
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
