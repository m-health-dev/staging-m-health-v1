"use client";

import { RichEditor } from "@/components/Form/RichEditor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@/components/ui/shadcn-io/dropzone";

import { DoctorSchema, EventSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash, Percent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";

import ContainerWrap from "@/components/utility/ContainerWrap";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { addDoctor, updateDoctor } from "@/lib/doctor/post-patch-doctor";
import { DynamicInputField } from "@/components/Form/DynamicInputField";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { routing } from "@/i18n/routing";
import { PhoneInput } from "@/components/Form/phone-input";
import { DoctorType } from "@/types/doctor.types";

const optionsActiveStatus = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const UpdateDoctorForm = ({ id, data }: { id: string; data: DoctorType }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photo_url || null,
  );

  // Error state untuk gambar yang gagal dimuat
  const [photoError, setPhotoError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingPhoto, setUploadLoadingPhoto] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState(data.name || "");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof DoctorSchema>>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      license_number: data.license_number || "",
      specialty: data.specialty || [],
      en_bio: data.en_bio || "",
      id_bio: data.id_bio || "",
      photo_url: data.photo_url || "",
      is_available: data.is_available || true,
      status: data.status || "active",
    },
  });

  // const [percentage, setPercentage] = useState(0);

  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     const real = Number(value.real_price);
  //     const disc = Number(value.discount_price);

  //     const handler = setTimeout(() => {
  //       if (real > 0 && disc > 0) {
  //         const result = Math.round((disc / real) * 100);
  //         setPercentage(100 - result);
  //       } else {
  //         setPercentage(0);
  //       }
  //     }, 500);

  //     return () => clearTimeout(handler);
  //   });

  //   return () => subscription.unsubscribe();
  // }, [form]);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "doctor");
    // formData.append("field", "referenceImage");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data.url) {
        toast.success("Image uploaded!", {
          description: `${data.url}`,
        });
      }

      return data.url;
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { description: `${error}` });
    }
  }

  async function handleDelete(
    url: string,
    field: "photo" | "default",
    index?: number,
  ) {
    setLoading(true);
    const deletedPath = url; // url relative yg dikirim ke API

    setDeletedImages((prev) => [...prev, deletedPath]); // ⬅ tambahkan ini

    const res = await fetch("/api/image/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: url }),
    });

    const data = await res.json();

    if (data.message) {
      setLoading(false);
      if (field === "photo") {
        setPhotoPreview(null);
        form.setValue("photo_url", "");
        toast.success("Image Photo Deleted!");
      }
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to delete");
    }
  }

  async function onSubmit(data: z.infer<typeof DoctorSchema>) {
    setLoading(true);
    const res = await updateDoctor(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.name} updated successfully!`);
      router.push(`/${locale}/studio/doctor`);
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }

  return (
    <ContainerWrap className="pb-20">
      <div className="my-10 bg-linear-to-b from-background via-background z-10 w-full py-5">
        {name && (
          <p className="bg-health inline-flex text-white px-2 rounded-md text-sm! py-1">
            Add Doctor
          </p>
        )}
        <h4 className="text-primary font-semibold">
          {name ? name : "Add Doctor"}
        </h4>
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl">
            <div className="space-y-5">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="h-12"
                          onChange={(e) => {
                            field.onChange(e); // sync ke react-hook-form
                            setName(e.target.value); // sync ke state untuk <h1>{name}</h1>
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="h-12"
                          onChange={(e) => {
                            field.onChange(e); // sync ke react-hook-form
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <hr />
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        {locale === routing.defaultLocale
                          ? "Nomor Telepon"
                          : "Phone Number"}
                      </FormLabel>
                      <FormControl>
                        <PhoneInput defaultCountry="ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        License Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="h-12"
                          onChange={(e) => {
                            field.onChange(e); // sync ke react-hook-form
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <hr />
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="photo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Photo
                      </FormLabel>
                      <FormDescription>
                        Rekomendasi: Aspek Rasio 1:1. (Ex. 1080x1080px /
                        720x720px). Max. 5MB
                      </FormDescription>

                      {uploadLoadingPhoto ? (
                        <Skeleton className="aspect-square w-2/6 rounded-full mt-3 object-cover border" />
                      ) : !photoPreview || photoError ? (
                        <FormControl>
                          <div>
                            {photoError && (
                              <div className="text-red-500 text-sm mb-2">
                                Gambar gagal dimuat. Silakan upload ulang.
                              </div>
                            )}
                            <Dropzone
                              accept={{ "image/*": [] }}
                              maxSize={1024 * 1024 * 5}
                              onDrop={async (acceptedFiles) => {
                                setUploadLoadingPhoto(true);
                                setPhotoError(false);
                                const url =
                                  await handleImageUpload(acceptedFiles);

                                if (url) {
                                  form.setValue("photo_url", url);
                                  setPhotoPreview(url); // tampilkan preview
                                  setUploadLoadingPhoto(false);
                                }
                              }}
                              onError={console.error}
                              className="hover:bg-muted bg-white rounded-2xl"
                            >
                              <DropzoneEmptyState />
                              <DropzoneContent />
                            </Dropzone>
                          </div>
                        </FormControl>
                      ) : (
                        photoPreview && (
                          <div className="relative mb-5 w-42 h-42">
                            <Image
                              src={photoPreview}
                              width={320}
                              height={320}
                              alt={photoPreview}
                              className="aspect-square w-42 h-42 rounded-full mt-3 object-cover border"
                              onError={() => setPhotoError(true)}
                            />
                            <Button
                              size="sm"
                              type="button"
                              variant={"destructive_outline"}
                              onClick={() =>
                                handleDelete(
                                  photoPreview.replace(
                                    process.env
                                      .NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                    "",
                                  ),
                                  "photo",
                                )
                              }
                              className="absolute w-10 h-10 top-5 right-0 rounded-full shadow-2xl"
                            >
                              {loading ? <Spinner /> : <Trash />}
                            </Button>
                          </div>
                        )
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DynamicInputField
                  form={form}
                  name="specialty"
                  label="Doctor Specialty"
                />
              </div>

              <hr />

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="id_bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Bio
                      </FormLabel>
                      <FormControl>
                        <RichEditor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="en_bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Bio
                      </FormLabel>
                      <FormControl>
                        <RichEditor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <hr />

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-primary font-semibold!">
                        Status
                      </FormLabel>

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-between w-full border border-input bg-white text-muted-foreground text-base! rounded-2xl px-3! h-12 font-normal hover:bg-white hover:text-foreground hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary",
                              field.value === "inactive" &&
                                "text-amber-500 font-semibold hover:text-amber-500 bg-amber-50",
                              field.value === "active" &&
                                "text-green-600 font-semibold hover:text-green-600 bg-green-50",
                            )}
                          >
                            {field.value
                              ? optionsActiveStatus.find(
                                  (o) => o.value === field.value,
                                )?.label
                              : "Pilih Status"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0 min-w-md max-w-full">
                          <Command>
                            <CommandInput placeholder="Cari Status..." />
                            <CommandList>
                              <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                              <CommandGroup className="p-2">
                                {optionsActiveStatus.map((o) => (
                                  <CommandItem
                                    key={o.value}
                                    value={o.value}
                                    className={cn(
                                      "font-sans mb-2 rounded-lg",
                                      o.value === "active" &&
                                        "bg-green-50! text-green-500! hover:bg-green-100! hover:ring ring-inset hover:ring-green-500",
                                      o.value === "inactive" &&
                                        "bg-amber-50! text-amber-500! hover:bg-amber-100! hover:ring ring-inset hover:ring-amber-500",
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
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem className="flex md:flex-row flex-col md:items-center items-start  space-y-2 md:justify-between justify-start bg-white p-5 border rounded-2xl shadow-[inset_0px_-5px_0px_0px_var(--color-primary)] hover:shadow-[inset_0px_0px_0px_0px_var(--color-primary)] transition-all duration-300">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Available Status
                        </FormLabel>
                        <FormDescription>
                          {field.value === true ? "Available" : "Not Available"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="lg:col-span-2 col-span-1 flex w-full items-center justify-center mt-5">
                <Button
                  type="submit"
                  size={"lg"}
                  disabled={loading}
                  className="rounded-full flex lg:w-fit w-full"
                >
                  {loading ? <Spinner /> : "Update"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </ContainerWrap>
  );
};

export default UpdateDoctorForm;
