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

import { InsuranceSchema, VendorSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";
import { ComboBoxVendor } from "../ComboBox";
import { Button } from "@/components/ui/button";
import { DynamicInputField } from "@/components/Form/DynamicInputField";
import { addVendor } from "@/lib/vendors/post-patch-vendor";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { addInsurance } from "@/lib/insurance/post-patch-insurance";
import { routing } from "@/i18n/routing";
import { PhoneInput } from "@/components/Form/phone-input";

const AddVendor = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [highlightPreview, setHighlightPreview] = useState<string | null>(null);
  const [agentPhotoPreview, setAgentPhotoPreview] = useState<string | null>(
    null,
  );

  // Error states untuk gambar yang gagal dimuat
  const [logoError, setLogoError] = useState(false);
  const [highlightError, setHighlightError] = useState(false);
  const [agentPhotoError, setAgentPhotoError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingLogo, setUploadLoadingLogo] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingAgentImage, setUploadLoadingAgentImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof InsuranceSchema>>({
    resolver: zodResolver(InsuranceSchema),
    defaultValues: {
      name: "",
      en_description: "",
      id_description: "",
      category: [],
      specialist: [],
      highlight_image: "",
      logo: "",
      agent_name: "",
      agent_number: "",
      agent_photo_url: "",
    },
  });

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "insurance");
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

  async function handleBatchImageUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("folder", "insurance");

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
    field: "logo" | "highlight" | "agent",
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
      if (field === "logo") {
        setLogoPreview(null);
        form.setValue("logo", "");
        toast.success("Image Logo Deleted!");
      } else if (field === "highlight") {
        setHighlightPreview(null);
        form.setValue("highlight_image", "");
        toast.success("Highlight Image Deleted!");
      } else if (field === "agent") {
        setAgentPhotoPreview(null);
        form.setValue("agent_photo_url", "");
        toast.success("Agent Photo Deleted!");
      }
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to delete");
    }
  }

  async function onSubmit(data: z.infer<typeof InsuranceSchema>) {
    setLoading(true);
    const res = await addInsurance(data);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.name} added successfully!`);
      router.push(`/${locale}/studio/insurance`);
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
            Add Insurance
          </p>
        )}
        <h4 className="text-primary font-semibold">
          {name ? name : "Add Insurance"}
        </h4>
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      Insurance Name
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
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start">
                <DynamicInputField
                  form={form}
                  name="category"
                  label="Insurance Category"
                />
                <DynamicInputField
                  form={form}
                  name="specialist"
                  label="Insurance Specialist"
                />
              </div>

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start">
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
                          <div>
                            {logoError && (
                              <div className="text-red-500 text-sm mb-2">
                                Gambar gagal dimuat. Silakan upload ulang.
                              </div>
                            )}
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
                            </Dropzone>
                          </div>
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
                        720x403px). Max. 5MB
                      </FormDescription>
                      {uploadLoadingHLImage ? (
                        <Skeleton className="aspect-video w-full rounded-2xl mt-3 object-cover border" />
                      ) : !highlightPreview ||
                        highlightPreview === null ||
                        highlightError ? (
                        <FormControl>
                          <div>
                            {highlightError && (
                              <div className="text-red-500 text-sm mb-2">
                                Gambar gagal dimuat. Silakan upload ulang.
                              </div>
                            )}
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
                            </Dropzone>
                          </div>
                        </FormControl>
                      ) : (
                        highlightPreview && (
                          <div className="relative">
                            <Image
                              src={highlightPreview}
                              width={720}
                              height={403}
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

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start">
                <FormField
                  control={form.control}
                  name="agent_photo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Agent Photo
                      </FormLabel>
                      <FormDescription>
                        Rekomendasi: Aspek Rasio 1:1. (Ex. 1080x1080px /
                        720x720px). Max. 5MB
                      </FormDescription>

                      {uploadLoadingAgentImage ? (
                        <Skeleton className="aspect-square w-2/6 rounded-full mt-3 object-cover border" />
                      ) : !agentPhotoPreview || agentPhotoError ? (
                        <FormControl>
                          <div>
                            {agentPhotoError && (
                              <div className="text-red-500 text-sm mb-2">
                                Gambar gagal dimuat. Silakan upload ulang.
                              </div>
                            )}
                            <Dropzone
                              accept={{ "image/*": [] }}
                              maxSize={1024 * 1024 * 5}
                              onDrop={async (acceptedFiles) => {
                                setUploadLoadingAgentImage(true);
                                setAgentPhotoError(false);
                                const url =
                                  await handleImageUpload(acceptedFiles);

                                if (url) {
                                  form.setValue("agent_photo_url", url);
                                  setAgentPhotoPreview(url); // tampilkan preview
                                  setUploadLoadingAgentImage(false);
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
                        agentPhotoPreview && (
                          <div className="relative mb-5 w-42 h-42">
                            <Image
                              src={agentPhotoPreview}
                              width={320}
                              height={320}
                              alt={agentPhotoPreview}
                              className="aspect-square w-42 h-42 rounded-full mt-3 object-cover border"
                              onError={() => setLogoError(true)}
                            />
                            <Button
                              size="sm"
                              type="button"
                              variant={"destructive_outline"}
                              onClick={() =>
                                handleDelete(
                                  agentPhotoPreview.replace(
                                    process.env
                                      .NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                    "",
                                  ),
                                  "agent",
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
                  name="agent_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Insurance Agent Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agent_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Agent Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneInput defaultCountry="ID" {...field} />
                      </FormControl>
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

              <div className="lg:col-span-2 col-span-1 flex w-full items-center justify-center mt-5">
                <Button
                  type="submit"
                  size={"lg"}
                  className="rounded-full flex lg:w-fit w-full"
                >
                  {loading ? <Spinner /> : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </ContainerWrap>
  );
};

export default AddVendor;
