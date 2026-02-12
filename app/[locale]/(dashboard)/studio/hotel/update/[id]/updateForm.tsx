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
import { HotelSchema, VendorSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash, Container } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { HotelType } from "@/types/hotel.types";
import { updateHotel } from "@/lib/hotel/post-patch-hotel";
import { useLocale } from "next-intl";
import { deleteHotel } from "@/lib/hotel/delete-hotel";
import { baseUrl } from "@/helper/baseUrl";
import { VendorHotelDeleteCopyFunction } from "@/components/vendor-hotel/vendor-hotel-delete-copy-function";

const UpdateHotelForm = ({
  id,
  hotelData,
}: {
  id: string;
  hotelData: HotelType;
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(hotelData.logo);
  const [highlightPreview, setHighlightPreview] = useState<string | null>(
    hotelData.highlight_image,
  );
  const [referencePreview, setReferencePreview] = useState<string[]>(
    hotelData.reference_image,
  );

  // Error states untuk gambar yang gagal dimuat
  const [logoError, setLogoError] = useState(false);
  const [highlightError, setHighlightError] = useState(false);
  const [referenceErrors, setReferenceErrors] = useState<{
    [key: number]: boolean;
  }>({});

  const [loading, setLoading] = useState(false);
  const [uploadLoadingLogo, setUploadLoadingLogo] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState(hotelData.name || "");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof HotelSchema>>({
    resolver: zodResolver(HotelSchema),
    defaultValues: {
      name: hotelData?.name || "",
      en_description: hotelData?.en_description || "",
      id_description: hotelData?.id_description || "",
      logo: logoPreview || "",
      highlight_image: hotelData?.highlight_image || "",
      reference_image: hotelData?.reference_image || [],
      location_map: hotelData?.location_map || "",
      location: hotelData?.location || "",
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
        },
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data.url) {
        toast.success("Image uploaded!", { description: `${data.url}` });
      }

      return data.url; // <= kembalikan public url
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { description: `${error}` });
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
        },
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data.url) {
        toast.success("Image uploaded!", { description: `${data}` });
      }

      return data; // array: ["url1", "url2"]
      // <= kembalikan public url
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { description: `${error}` });
    }
  }

  async function handleDelete(
    url: string,
    field: "logo" | "highlight" | "reference",
    index?: number,
  ) {
    setLoading(true);

    setDeletedImages((prev) => [...prev, url]);

    // Optimistic UI update
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

    try {
      const res = await fetch("/api/image/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: url }),
      });

      const data = await res.json();

      if (data.message) {
        toast.success(
          field === "logo"
            ? "Image Logo Deleted!"
            : field === "highlight"
              ? "Highlight Image Deleted!"
              : "Referenced Image Deleted!",
        );
      } else {
        console.warn("S3 delete issue:", data.error);
        toast.warning(
          "Image removed from form. Storage cleanup may be needed.",
        );
      }
    } catch (error) {
      console.error("Delete request failed:", error);
      toast.warning("Image removed from form. Storage cleanup may be needed.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof HotelSchema>) {
    setLoading(true);
    const res = await updateHotel(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.name} updated successfully!`);
      router.push(`/${locale}/studio/hotel`);
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }

  return (
    <ContainerWrap className="pb-20">
      <div className="my-10 sticky top-0 bg-linear-to-b from-background via-background z-10 w-full py-5 flex justify-between items-center">
        <div>
          {name && (
            <p className="bg-health inline-flex text-white px-2 rounded-md text-sm! py-1">
              Update Hotel
            </p>
          )}
          <h4 className="text-primary font-semibold ">
            {name ? name : "Update Hotel"}
          </h4>
          <p className="text-sm! text-muted-foreground">{hotelData.slug}</p>
        </div>
        <VendorHotelDeleteCopyFunction
          id={id}
          deleteAction={deleteHotel}
          name={hotelData.name}
          locale={locale}
          resourceType="hotel"
          router={router}
          slug={`${baseUrl}/${locale}/hotel/${hotelData.slug}`}
        />
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-5xl"
            autoComplete="off"
          >
            <div className="space-y-5">
              <div className="lg:grid flex flex-col grid-cols-2 gap-5">
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

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="h-12" />
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
                      <FormDescription>
                        Rekomendasi: Aspek Rasio 1:1. (Ex. 1080x1080px /
                        720x720px). Max. 5MB
                      </FormDescription>

                      {uploadLoadingLogo ? (
                        <Skeleton className="aspect-square w-2/6 rounded-full mt-3 object-cover border" />
                      ) : !logoPreview || logoError ? (
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            onDrop={async (acceptedFiles) => {
                              setUploadLoadingLogo(true);
                              setLogoError(false);
                              const url =
                                await handleImageUpload(acceptedFiles);

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
                            {logoError && (
                              <div className="text-red-500 text-sm mt-2">
                                Gambar gagal dimuat. Silakan upload ulang.
                              </div>
                            )}
                          </Dropzone>
                        </FormControl>
                      ) : (
                        logoPreview && (
                          <div className="relative mb-5 w-42 h-42">
                            <Image
                              src={logoPreview}
                              width={320}
                              height={320}
                              alt={logoPreview}
                              className="aspect-square w-42 h-42 rounded-full mt-3 object-cover border"
                              onError={() => setLogoError(true)}
                            />
                            <Button
                              size="sm"
                              type="button"
                              variant={"destructive_outline"}
                              onClick={() =>
                                handleDelete(
                                  logoPreview.replace(
                                    process.env
                                      .NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                    "",
                                  ),
                                  "logo",
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

                <FormField
                  control={form.control}
                  name="highlight_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Highlight Image
                      </FormLabel>
                      <FormDescription>
                        Rekomendasi: Aspek Rasio 16:9. (Ex. 1920x1080px /
                        720x405px). Max. 5MB
                      </FormDescription>
                      {uploadLoadingHLImage ? (
                        <Skeleton className="aspect-video w-full rounded-2xl mt-3 object-cover border" />
                      ) : !highlightPreview || highlightError ? (
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            onDrop={async (acceptedFiles) => {
                              setUploadLoadingHLImage(true);
                              setHighlightError(false);
                              const url =
                                await handleImageUpload(acceptedFiles);

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
                            {highlightError && (
                              <div className="text-red-500 text-sm mt-2">
                                Gambar gagal dimuat. Silakan upload ulang.
                              </div>
                            )}
                          </Dropzone>
                        </FormControl>
                      ) : (
                        highlightPreview && (
                          <div className="relative">
                            <Image
                              src={highlightPreview}
                              width={320}
                              height={320}
                              alt={highlightPreview}
                              className="aspect-video w-full rounded-2xl mt-3 object-cover border"
                              onError={() => setHighlightError(true)}
                            />
                            <Button
                              size="sm"
                              type="button"
                              variant={"destructive_outline"}
                              onClick={() =>
                                handleDelete(
                                  highlightPreview.replace(
                                    process.env
                                      .NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                    "",
                                  ),
                                  "highlight",
                                )
                              }
                              className="absolute w-10 h-10 top-5 right-2 rounded-full"
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
              </div>

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

              <FormField
                control={form.control}
                name="reference_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      Reference Images
                    </FormLabel>
                    <FormDescription>
                      Rekomendasi: Aspek Rasio 16:9. (Ex. 1920x1080px /
                      720x403px). Max. 5MB
                    </FormDescription>
                    {uploadLoadingRFImage ? (
                      <div className="lg:grid flex flex-col grid-cols-3 gap-5 mb-3">
                        <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                        <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                        <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                      </div>
                    ) : referencePreview.length === 0 ? (
                      <FormControl>
                        <Dropzone
                          accept={{ "image/*": [] }}
                          maxSize={1024 * 1024 * 5}
                          maxFiles={5}
                          src={[]}
                          onDrop={async (acceptedFiles) => {
                            setUploadLoadingRFImage(true);

                            const urls =
                              await handleBatchImageUpload(acceptedFiles);

                            if (urls) {
                              const oldImages =
                                form.getValues("reference_image") || [];
                              const merged = [...oldImages, ...urls];
                              form.setValue("reference_image", merged);
                              setReferencePreview(merged);
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
                    ) : (
                      referencePreview && (
                        <div className="lg:grid flex flex-col grid-cols-3 gap-5 mb-3">
                          {referencePreview.map((url, i) =>
                            referenceErrors[i] ? (
                              <div key={url} className="relative">
                                <Dropzone
                                  accept={{ "image/*": [] }}
                                  maxSize={1024 * 1024 * 5}
                                  maxFiles={1}
                                  onDrop={async (acceptedFiles) => {
                                    setUploadLoadingRFImage(true);
                                    const urls =
                                      await handleBatchImageUpload(
                                        acceptedFiles,
                                      );

                                    if (urls && urls.length > 0) {
                                      const newReferencePreview = [
                                        ...referencePreview,
                                      ];
                                      newReferencePreview[i] = urls[0];
                                      form.setValue(
                                        "reference_image",
                                        newReferencePreview,
                                      );
                                      setReferencePreview(newReferencePreview);
                                      setReferenceErrors((prev) => ({
                                        ...prev,
                                        [i]: false,
                                      }));
                                      setUploadLoadingRFImage(false);
                                    }
                                  }}
                                  onError={console.error}
                                  className="hover:bg-muted bg-white rounded-2xl aspect-video"
                                >
                                  <DropzoneEmptyState />
                                  <DropzoneContent />
                                  <div className="text-red-500 text-sm mt-2">
                                    Gambar gagal dimuat. Silakan upload ulang.
                                  </div>
                                </Dropzone>
                              </div>
                            ) : (
                              <div key={url} className="relative">
                                <Image
                                  src={url}
                                  width={320}
                                  height={320}
                                  alt={url}
                                  className="aspect-video w-full rounded-2xl mt-3 object-cover border"
                                  onError={() =>
                                    setReferenceErrors((prev) => ({
                                      ...prev,
                                      [i]: true,
                                    }))
                                  }
                                />
                                <Button
                                  size="sm"
                                  type="button"
                                  variant={"destructive_outline"}
                                  onClick={() =>
                                    handleDelete(
                                      url.replace(
                                        process.env
                                          .NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                        "",
                                      ),
                                      "reference",
                                      i,
                                    )
                                  }
                                  className="absolute w-10 h-10 top-5 right-2 rounded-full"
                                >
                                  {loading ? <Spinner /> : <Trash />}
                                </Button>
                              </div>
                            ),
                          )}
                          {referencePreview.length !== 5 && (
                            <FormControl>
                              <Dropzone
                                accept={{ "image/*": [] }}
                                maxSize={1024 * 1024 * 5}
                                maxFiles={5}
                                src={[]}
                                onDrop={async (acceptedFiles) => {
                                  setUploadLoadingRFImage(true);

                                  const urls =
                                    await handleBatchImageUpload(acceptedFiles);

                                  if (urls) {
                                    const oldImages =
                                      form.getValues("reference_image") || [];
                                    const merged = [...oldImages, ...urls];
                                    form.setValue("reference_image", merged);
                                    setReferencePreview(merged);
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
                          )}
                        </div>
                      )
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="lg:col-span-2 col-span-1 flex w-full items-center justify-center mt-5">
                <Button
                  type="submit"
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

export default UpdateHotelForm;
