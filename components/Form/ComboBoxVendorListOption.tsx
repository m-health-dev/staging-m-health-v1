"use client";

import { useEffect, useState, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
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
import { cn } from "@/lib/utils";
import {
  getAllVendorWithoutPagination,
  getVendorByID,
} from "@/lib/vendors/get-vendor";
import { VendorType } from "@/types/vendor.types";
import Image from "next/image";
import Avatar from "boring-avatars";
import LoadingComponent from "@/components/utility/loading-component";

export function ComboBoxVendorListOption({
  readVendorID,
}: {
  readVendorID?: string;
}) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [vendorData, setVendorData] = useState<VendorType[]>([]);
  const [vendorName, setVendorName] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      const data = (await getAllVendorWithoutPagination()).data;

      if (readVendorID) {
        const read = (await getVendorByID(readVendorID)).data;
        setVendorName(read.name);
        setLoading(false);
      }

      setVendorData(data);
      setLoading(false);
    };
    fetchVendor();
  }, []);

  // tampilkan 10 pertama, jika tidak ada pencarian
  const filteredVendors = useMemo(() => {
    if (!query.trim()) {
      return vendorData.slice(0, 10);
    }

    const q = query.toLowerCase();

    return vendorData.filter((v) => v.name.toLowerCase().includes(q));
  }, [vendorData, query]);

  const vendorId = useWatch({ name: "vendor_id", control: form.control });
  const selectedVendor = vendorData.find((v) => v.id === vendorId);

  return (
    <FormField
      control={form.control}
      name="vendor_id"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="text-primary font-semibold!">Vendor</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={loading}
                className={cn(
                  "justify-between w-full border border-input bg-white text-muted-foreground text-base! rounded-2xl px-3! h-12 font-normal hover:bg-white hover:text-foreground hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary",
                  field.value && "text-primary font-semibold hover:text-primary"
                )}
              >
                {loading ? (
                  <LoadingComponent className="h-fit" />
                ) : selectedVendor ? (
                  selectedVendor.name
                ) : vendorName ? (
                  vendorName
                ) : (
                  "Pilih Vendor"
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 min-w-md max-w-full">
              <Command>
                <CommandInput
                  placeholder="Cari vendor..."
                  onValueChange={(val) => setQuery(val)}
                />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                {loading ? (
                  <div className="p-4 flex justify-center">
                    <LoadingComponent className="min-h-fit!" />
                  </div>
                ) : (
                  <CommandGroup className="max-h-64 overflow-y-auto font-sans">
                    {filteredVendors.map((vendor) => (
                      <CommandItem
                        key={vendor.id}
                        value={vendor.name}
                        onSelect={() => {
                          form.setValue("vendor_id", vendor.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        {vendor.name && vendor.logo ? (
                          <Image
                            src={vendor.logo}
                            alt={vendor.name || "Vendor Logo"}
                            width={100}
                            height={100}
                            className="object-cover w-5! h-5!  rounded-full border"
                          />
                        ) : (
                          <Avatar
                            name={vendor.name}
                            className="w-5! h-5! border rounded-full"
                            colors={[
                              "#3e77ab",
                              "#22b26e",
                              "#f2f26f",
                              "#fff7bd",
                              "#95cfb7",
                            ]}
                            variant="beam"
                            size={20}
                          />
                        )}
                        {vendor.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
