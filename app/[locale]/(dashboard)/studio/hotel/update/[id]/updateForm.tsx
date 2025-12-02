"use client";

import { CalendarRangeField } from "@/components/Form/CalendarRangeField";
import CalendarSchedule from "@/components/Form/CalendarSchedule";
import { ComboBoxField } from "@/components/Form/ComboBox";
import { PhoneInput } from "@/components/Form/phone-input";
import { RupiahInput } from "@/components/Form/PriceInput";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@/components/ui/shadcn-io/dropzone";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { HotelSchema, VendorSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Switch } from "@radix-ui/react-switch";
import { EyeClosed, Eye, Trash } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Label } from "recharts";
import { toast } from "sonner";
import z from "zod";
import { ComboBoxVendor } from "../../ComboBox";
import { Button } from "@/components/ui/button";
import { DynamicInputField } from "@/components/Form/DynamicInputField";
import { addVendor, updateVendor } from "@/lib/vendors/post-patch-vendor";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { VendorType } from "@/types/vendor.types";
import { HotelType } from "@/types/hotel.types";
import { updateHotel } from "@/lib/hotel/post-patch-hotel";

const UpdateHotelForm = ({
  id,
  hotelData,
}: {
  id: string;
  hotelData: HotelType;
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(hotelData.logo);
  const [highlightPreview, setHighlightPreview] = useState<string | null>(
    hotelData.highlight_image
  );
  const [referencePreview, setReferencePreview] = useState<string[]>(
    hotelData.reference_image
  );

  const [loading, setLoading] = useState(false);
  const [uploadLoadingLogo, setUploadLoadingLogo] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState("");

  const form = useForm<z.infer<typeof HotelSchema>>({
    resolver: zodResolver(HotelSchema),
    defaultValues: {
      name: hotelData?.name || "",
      en_description: hotelData?.en_description || "",
      id_description: hotelData?.id_description || "",
      logo: hotelData?.logo || "",
      highlight_image: hotelData?.highlight_image || "",
      reference_image: hotelData?.reference_image || [],
      location_map: hotelData?.location_map || "",
    },
  });

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "hotels");
    // formData.append("field", "referenceImage");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data.url) {
        toast.success("Image uploaded!");
      }

      return data.url; // <= kembalikan public url
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  }

  async function handleBatchImageUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("folder", "hotels");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload/batch`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data.url) {
        toast.success("Image uploaded!");
      }

      return data; // array: ["url1", "url2"]
      // <= kembalikan public url
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  }

  async function handleDelete(
    url: string,
    field: "logo" | "highlight" | "reference",
    index?: number
  ) {
    const deletedPath = url; // url relative yg dikirim ke API

    setDeletedImages((prev) => [...prev, deletedPath]); // ⬅ tambahkan ini

    const res = await fetch("/api/image/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: url }),
    });

    const data = await res.json();

    if (data.message) {
      toast.success("Image deleted");

      // HAPUS DARI STATE PREVIEW
      if (field === "logo") {
        setLogoPreview(null);
        form.setValue("logo", "");
      } else if (field === "highlight") {
        setHighlightPreview(null);
        form.setValue("highlight_image", "");
      } else if (field === "reference") {
        setReferencePreview((prev) => {
          const newArr = prev.filter((_, i) => i !== index);
          form.setValue("reference_image", newArr);
          return newArr;
        });
      }
    } else {
      toast.error(data.error || "Failed to delete");
    }
  }

  async function onSubmit(data: z.infer<typeof HotelSchema>) {
    setLoading(true);
    const res = await updateHotel(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`Hotel Update Success!`);
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }

  return (
    <>
      <div className="my-10 sticky top-0 bg-linear-to-b from-background via-background p-4 rounded-2xl z-10 w-full">
        <h3 className="text-primary font-semibold">Update Hotel</h3>
        <p className="text-primary mt-2 uppercase">{id.slice(0, 8)}</p>
      </div>
      <ContainerWrap size="xl">
        <div className="flex flex-col w-full justify-center items-center">
          <div className="mb-8 bg-white p-5 rounded-2xl border w-full">
            {uploadLoadingHLImage ? (
              <Skeleton className="aspect-video w-full rounded-2xl mt-3 object-cover border" />
            ) : (
              highlightPreview && (
                <Image
                  src={highlightPreview}
                  width={320}
                  height={320}
                  alt={highlightPreview}
                  className="aspect-16/5 w-full rounded-2xl object-cover border object-center"
                />
              )
            )}
            <div className="flex items-center gap-5 mt-5">
              {uploadLoadingLogo ? (
                <Skeleton className="aspect-square w-16 rounded-full mt-3 object-cover border" />
              ) : (
                logoPreview && (
                  <Image
                    src={logoPreview}
                    width={320}
                    height={320}
                    alt={logoPreview}
                    className="aspect-square w-16 rounded-full object-cover border"
                  />
                )
              )}
              <h5 className="text-primary font-bold">
                {hotelData?.name || name}
              </h5>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-5xl"
              autoComplete="off"
            >
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Hotel Name
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
                  name="location_map"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Maps Location URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="url" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="lg:col-span-2 col-span-1">
                  <FormField
                    control={form.control}
                    name="id_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Indonesian Description
                        </FormLabel>
                        <FormControl>
                          <RichEditor {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="lg:col-span-2 col-span-1">
                  <FormField
                    control={form.control}
                    name="en_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          English Description
                        </FormLabel>
                        <FormControl>
                          <RichEditor {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="lg:grid grid-cols-2 flex flex-col gap-5 items-start">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Logo Image
                        </FormLabel>

                        {uploadLoadingLogo ? (
                          <Skeleton className="aspect-square w-2/6 rounded-full mt-3 object-cover border" />
                        ) : (
                          logoPreview && (
                            <Image
                              src={logoPreview}
                              width={320}
                              height={320}
                              alt={logoPreview}
                              className="aspect-square w-2/6 rounded-full mt-3 object-cover border"
                            />
                          )
                        )}
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            maxFiles={1}
                            src={[]}
                            onDrop={async (acceptedFiles) => {
                              field.onChange(acceptedFiles);

                              setUploadLoadingLogo(true);
                              const url = await handleImageUpload(
                                acceptedFiles
                              );

                              if (url) {
                                form.setValue("logo", url);
                                setLogoPreview(url); // tampilkan preview
                                setUploadLoadingLogo(false);
                              }
                            }}
                            onError={console.error}
                            className="hover:bg-muted bg-white rounded-2xl"
                          >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="highlight_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Highlight Image
                        </FormLabel>
                        {uploadLoadingHLImage ? (
                          <Skeleton className="aspect-video w-full rounded-2xl mt-3 object-cover border" />
                        ) : (
                          highlightPreview && (
                            <Image
                              src={highlightPreview}
                              width={320}
                              height={320}
                              alt={highlightPreview}
                              className="aspect-video w-full rounded-2xl mt-3 object-cover border"
                            />
                          )
                        )}
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            maxFiles={1}
                            src={[]}
                            onDrop={async (acceptedFiles) => {
                              field.onChange(acceptedFiles);
                              setUploadLoadingHLImage(true);
                              const url = await handleImageUpload(
                                acceptedFiles
                              );

                              if (url) {
                                form.setValue("highlight_image", url);
                                setHighlightPreview(url);
                                setUploadLoadingHLImage(false);
                              }
                            }}
                            onError={console.error}
                            className="hover:bg-muted bg-white rounded-2xl"
                          >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reference_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Reference Images
                      </FormLabel>
                      <FormControl>
                        <Dropzone
                          accept={{ "image/*": [] }}
                          maxSize={1024 * 1024 * 5}
                          maxFiles={5}
                          src={[]}
                          onDrop={async (acceptedFiles) => {
                            field.onChange(acceptedFiles);
                            setUploadLoadingRFImage(true);
                            const urls = await handleBatchImageUpload(
                              acceptedFiles
                            );

                            if (urls) {
                              form.setValue("reference_image", urls);
                              setReferencePreview(urls);
                              setUploadLoadingRFImage(false);
                            }
                          }}
                          onError={console.error}
                          className="hover:bg-muted bg-white rounded-2xl"
                        >
                          <DropzoneEmptyState />
                          <DropzoneContent />
                        </Dropzone>
                      </FormControl>

                      {uploadLoadingRFImage ? (
                        <div className="lg:grid flex flex-col grid-cols-3 gap-5 mb-3">
                          <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                          <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                          <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                        </div>
                      ) : (
                        referencePreview && (
                          <div className="lg:grid flex flex-col grid-cols-3 gap-5 mb-3">
                            {referencePreview.map((url, i) => (
                              <div key={url} className="relative">
                                <Image
                                  src={url}
                                  width={320}
                                  height={320}
                                  alt={url}
                                  className="aspect-video w-full rounded-2xl mt-3 object-cover border"
                                />
                                <Button
                                  size="sm"
                                  type="button"
                                  variant="destructive"
                                  onClick={() =>
                                    handleDelete(
                                      url.replace(
                                        "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/",
                                        ""
                                      ),
                                      "reference",
                                      i
                                    )
                                  }
                                  className="absolute w-10 h-10 top-5 right-2 rounded-full"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="lg:col-span-2 col-span-1 w-full mt-5">
                  <Button type="submit" className="rounded-full flex w-full">
                    {loading ? <Spinner /> : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </ContainerWrap>
    </>
  );
};

export default UpdateHotelForm;
