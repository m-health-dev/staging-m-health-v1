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
import { DoctorType } from "@/types/consult.types";
import {
  getAllDoctorsWithoutPagination,
  getDoctorsByID,
} from "@/lib/doctor/get-doctor";

export function ComboBoxDoctorListOption({
  readDoctorID,
}: {
  readDoctorID?: string;
}) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [doctorData, setDoctorData] = useState<DoctorType[]>([]);
  const [doctorName, setDoctorName] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      const data = (await getAllDoctorsWithoutPagination()).data;

      if (readDoctorID) {
        const read = (await getDoctorsByID(readDoctorID)).data;
        setDoctorName(read.name);
        setLoading(false);
      }

      setDoctorData(data);
      setLoading(false);
    };
    fetchDoctor();
  }, []);

  // tampilkan 10 pertama, jika tidak ada pencarian
  const filteredDoctors = useMemo(() => {
    if (!query.trim()) {
      return doctorData.slice(0, 10);
    }

    const q = query.toLowerCase();

    return doctorData.filter((v) => v.name.toLowerCase().includes(q));
  }, [doctorData, query]);

  const doctorId = useWatch({ name: "doctor_id", control: form.control });
  const selectedDoctor = doctorData.find((v) => v.id === doctorId);
  return (
    <FormField
      control={form.control}
      name="doctor_id"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="text-primary font-semibold!">Doctor</FormLabel>

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
                ) : selectedDoctor ? (
                  selectedDoctor.name
                ) : doctorName ? (
                  doctorName
                ) : (
                  "Pilih Dokter"
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 min-w-md max-w-full">
              <Command>
                <CommandInput
                  placeholder="Cari Dokter..."
                  onValueChange={(val) => setQuery(val)}
                />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                {loading ? (
                  <div className="p-4 flex justify-center">
                    <LoadingComponent className="min-h-fit!" />
                  </div>
                ) : (
                  <CommandGroup className="max-h-64 overflow-y-auto font-sans">
                    {filteredDoctors.map((doctor) => (
                      <CommandItem
                        key={doctor.id}
                        value={doctor.name}
                        onSelect={() => {
                          form.setValue("doctor_id", doctor.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        {doctor.name && doctor.photo_url ? (
                          <Image
                            src={doctor.photo_url}
                            alt={doctor.name || "Doctor Photo"}
                            width={100}
                            height={100}
                            className="object-cover w-5! h-5!  rounded-full border"
                          />
                        ) : (
                          <Avatar
                            name={doctor.name}
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
                        {doctor.name}
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
