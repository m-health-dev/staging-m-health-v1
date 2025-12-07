"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useFormContext } from "react-hook-form";
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
import { getAllVendorWithoutPagination } from "@/lib/vendors/get-vendor";
import { VendorType } from "@/types/vendor.types";
import { HotelType } from "@/types/hotel.types";
import {
  getAllHotelWithoutPagination,
  getHotelByID,
} from "@/lib/hotel/get-hotel";
import LoadingComponent from "@/components/utility/loading-component";
import Image from "next/image";
import Avatar from "boring-avatars";

export function ComboBoxHotelListOption({
  readHotelID,
}: {
  readHotelID?: string;
}) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [hotelData, setHotelData] = useState<HotelType[]>([]);
  const [hotelName, setHotelName] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      const res = await getAllHotelWithoutPagination();

      if (readHotelID) {
        const read = (await getHotelByID(readHotelID)).data;
        setHotelName(read.name);
        setLoading(false);
      }

      setHotelData(res.data);
      setLoading(false); // ← ini yang benar
    };

    fetchHotel();
  }, []);

  // tampilkan 10 pertama, jika tidak ada pencarian
  const filteredHotels = useMemo(() => {
    if (!query.trim()) {
      return hotelData.slice(0, 10);
    }

    const q = query.toLowerCase();

    return hotelData.filter((v) => v.name.toLowerCase().includes(q));
  }, [hotelData, query]);

  const selectedHotel = hotelData.find((v) => v.id === form.watch("hotel_id"));

  return (
    <FormField
      control={form.control}
      name="hotel_id"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="text-primary font-semibold!">Hotel</FormLabel>

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
                ) : hotelName ? (
                  hotelName
                ) : selectedHotel ? (
                  selectedHotel.name
                ) : (
                  "Pilih Hotel"
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 min-w-md max-w-full">
              <Command>
                <CommandInput
                  placeholder="Cari hotel..."
                  onValueChange={(val) => setQuery(val)}
                />
                {/* <CommandEmpty>Tidak ditemukan.</CommandEmpty> */}
                {loading ? (
                  <div className="p-4 flex justify-center">
                    <LoadingComponent className="min-h-fit!" />
                  </div>
                ) : (
                  <CommandGroup className="max-h-64 overflow-y-auto font-sans">
                    {filteredHotels.map((hotel) => (
                      <CommandItem
                        key={hotel.id}
                        value={hotel.name}
                        onSelect={() => {
                          form.setValue("hotel_id", hotel.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        {hotel.logo ? (
                          <Image
                            src={hotel.logo}
                            alt={hotel.name}
                            width={20}
                            height={20}
                            className="object-cover w-5! h-5! rounded-full border"
                          />
                        ) : (
                          <Avatar
                            name={hotel.name}
                            variant="beam"
                            size={20}
                            className="w-5! h-5! border rounded-full"
                          />
                        )}
                        {hotel.name}
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
