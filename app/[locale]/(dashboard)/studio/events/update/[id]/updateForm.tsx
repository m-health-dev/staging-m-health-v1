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

import { EventSchema } from "@/lib/zodSchema";
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

import { addEvent, updateEvent } from "@/lib/events/post-patch-events";
import { CalendarCheckInOut } from "@/components/Form/CalendarCheckInOut";
import { ComboBoxStatus } from "@/components/Form/ComboBoxStatus";
import { EventsType } from "@/types/events.types";
import { Studio1DeleteCopyFunction } from "@/components/package-wellness-medical/package-wellness-medical-delete-copy-function";
import { deleteEvent } from "@/lib/events/delete-events";
import { baseUrl } from "@/helper/baseUrl";

type UpdateForm = {
  id: string;
  data: EventsType;
};

const UpdateEventForm = ({ id, data }: UpdateForm) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    data.organized_image
  );
  const [highlightPreview, setHighlightPreview] = useState<string | null>(
    data.highlight_image
  );
  const [referencePreview, setReferencePreview] = useState<string[]>(
    data.reference_image
  );

  const [loading, setLoading] = useState(false);
  const [uploadLoadingLogo, setUploadLoadingLogo] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState(data.id_title || "");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      en_title: data.en_title || "",
      id_title: data.id_title || "",
      highlight_image: data.highlight_image || "",
      reference_image: data.reference_image || [],
      en_description: data.en_description || "",
      id_description: data.id_description || "",
      organized_by: data.organized_by || "",
      organized_image: data.organized_image || "",
      location_name: data.location_name || "",
      location_map: data.location_map || "",
      registration_url: data.registration_url || "",
      start_date: data.start_date ? new Date(data.start_date) : new Date(),
      end_date: data.end_date ? new Date(data.end_date) : new Date(),
      status: data.status || "",
    },
  });

  // const [percentage, setPercentage] = useState(0);

  // useEffect(() => {
  //   const real = Number(form.getValues("real_price"));
  //   const disc = Number(form.getValues("discount_price"));

  //   const handler = setTimeout(() => {
  //     if (real > 0 && disc > 0) {
  //       const result = Math.round((disc / real) * 100);
  //       setPercentage(100 - result);
  //     } else {
  //       setPercentage(0);
  //     }
  //   }, 500);

  //   return () => clearTimeout(handler);
  // }, [form.watch("real_price"), form.watch("discount_price")]);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "events");
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

  async function handleBatchImageUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("folder", "events/contents");

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
        toast.success("Image uploaded!", {
          description: `${data}`,
        });
      }

      return data;
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { description: `${error}` });
    }
  }

  async function handleDelete(
    url: string,
    field: "logo" | "highlight" | "reference",
    index?: number
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
      if (field === "logo") {
        setLogoPreview(null);
        form.setValue("organized_image", "");
        toast.success("Image Logo Deleted!");
      } else if (field === "highlight") {
        setHighlightPreview(null);
        form.setValue("highlight_image", "");
        toast.success("Highlight Image Deleted!");
      } else if (field === "reference") {
        setReferencePreview((prev) => {
          const newArr = prev.filter((_, i) => i !== index);
          form.setValue("reference_image", newArr);
          return newArr;
        });
        toast.success("Referenced Image Deleted!");
      }
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to delete");
    }
  }

  async function onSubmit(data: z.infer<typeof EventSchema>) {
    setLoading(true);
    const res = await updateEvent(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.id_title} added successfully!`);
      router.push(`/${locale}/studio/events`);
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
              Update Event
            </p>
          )}
          <h4 className="text-primary font-semibold">
            {name ? name : "Update Event"}
          </h4>
          <p className="text-sm! text-muted-foreground">{data.slug}</p>
        </div>
        <Studio1DeleteCopyFunction
          id={id}
          deleteAction={deleteEvent}
          name={data.id_title}
          locale={locale}
          resourceLabel="Event"
          router={router}
          slug={`${baseUrl}/${locale}/event/${data.slug}`}
        />
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl">
            <div className="space-y-5">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="id_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Title
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
                  name="en_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Title
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
              <div>
                <FormField
                  control={form.control}
                  name="start_date"
                  render={() => (
                    <FormItem>
                      {/* <FormLabel className="text-primary font-semibold!">
                        Event Date & Time
                      </FormLabel> */}

                      <CalendarCheckInOut
                        startDate={form.watch("start_date")}
                        endDate={form.watch("end_date")}
                        onChangeStart={(date) =>
                          form.setValue("start_date", date, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        onChangeEnd={(date) =>
                          form.setValue("end_date", date, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <hr />
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="organized_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Organizer Logo
                      </FormLabel>

                      {!logoPreview ? (
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            onDrop={async (acceptedFiles) => {
                              setUploadLoadingLogo(true);
                              const url = await handleImageUpload(
                                acceptedFiles
                              );

                              if (url) {
                                form.setValue("organized_image", url);
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
                      ) : uploadLoadingLogo ? (
                        <Skeleton className="aspect-square w-2/6 rounded-full mt-3 object-cover border" />
                      ) : (
                        logoPreview && (
                          <div className="relative mb-5 w-42 h-42">
                            <Image
                              src={logoPreview}
                              width={320}
                              height={320}
                              alt={logoPreview}
                              className="aspect-square w-42 h-42 rounded-full mt-3 object-cover border"
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
                                    ""
                                  ),
                                  "logo"
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
                  name="organized_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Organizer Name
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
                  name="highlight_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Highlight Image
                      </FormLabel>
                      {highlightPreview === null ? (
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            onDrop={async (acceptedFiles) => {
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
                      ) : uploadLoadingHLImage ? (
                        <Skeleton className="aspect-video w-full rounded-2xl mt-3 object-cover border" />
                      ) : (
                        highlightPreview && (
                          <div className="relative">
                            <Image
                              src={highlightPreview}
                              width={320}
                              height={320}
                              alt={highlightPreview}
                              className="aspect-video w-full rounded-2xl mt-3 object-cover border"
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
                                    ""
                                  ),
                                  "highlight"
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
                <FormField
                  control={form.control}
                  name="reference_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Reference Images
                      </FormLabel>
                      {referencePreview.length === 0 ? (
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            maxFiles={5}
                            src={[]}
                            onDrop={async (acceptedFiles) => {
                              setUploadLoadingRFImage(true);

                              const urls = await handleBatchImageUpload(
                                acceptedFiles
                              );

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
                            className="hover:bg-muted bg-white rounded-2xl w-full"
                          >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>
                        </FormControl>
                      ) : uploadLoadingRFImage ? (
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-3">
                          <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                          <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                        </div>
                      ) : (
                        referencePreview && (
                          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-3 mt-3">
                            {referencePreview.map((url, i) => (
                              <div key={i} className="relative">
                                <Image
                                  src={url}
                                  width={320}
                                  height={320}
                                  alt={url}
                                  className="aspect-video w-full rounded-2xl object-cover border"
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
                                        ""
                                      ),
                                      "reference",
                                      i
                                    )
                                  }
                                  className="absolute w-10 h-10 top-3 right-2 rounded-full"
                                >
                                  {loading ? <Spinner /> : <Trash />}
                                </Button>
                              </div>
                            ))}
                            {referencePreview.length !== 5 && (
                              <FormControl>
                                <Dropzone
                                  accept={{ "image/*": [] }}
                                  maxSize={1024 * 1024 * 5}
                                  maxFiles={5}
                                  src={[]}
                                  onDrop={async (acceptedFiles) => {
                                    setUploadLoadingRFImage(true);

                                    const urls = await handleBatchImageUpload(
                                      acceptedFiles
                                    );

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
                                  className="hover:bg-muted bg-white rounded-2xl w-full"
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
              </div>

              <hr />

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
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

              <hr />

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="location_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Location Name
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
                <FormField
                  control={form.control}
                  name="location_map"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Location Map
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
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

              <div>
                {" "}
                <FormField
                  control={form.control}
                  name="registration_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Registration URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
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
              <ComboBoxStatus />

              <div className="lg:col-span-2 col-span-1 flex w-full items-center justify-center mt-5">
                <Button
                  type="submit"
                  size={"lg"}
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

export default UpdateEventForm;
