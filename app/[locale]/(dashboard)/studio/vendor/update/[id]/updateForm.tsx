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
import { VendorSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { VendorType } from "@/types/vendor.types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { DeleteCopyFunction } from "@/components/vendor-hotel/delete-copy-function";
import { deleteVendor } from "@/lib/vendors/delete-vendor";
import { baseUrl } from "@/helper/baseUrl";

const UpdateVendorForm = ({
  id,
  vendorData,
}: {
  id: string;
  vendorData: VendorType;
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    vendorData.logo
  );
  const [highlightPreview, setHighlightPreview] = useState<string | null>(
    vendorData.highlight_image
  );
  const [referencePreview, setReferencePreview] = useState<string[]>(
    vendorData.reference_image
  );

  const [loading, setLoading] = useState(false);
  const [uploadLoadingLogo, setUploadLoadingLogo] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState(vendorData.name || "");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof VendorSchema>>({
    resolver: zodResolver(VendorSchema),
    defaultValues: {
      name: vendorData?.name || "",
      en_description: vendorData?.en_description || "",
      id_description: vendorData?.id_description || "",
      category: vendorData?.category || "",
      specialist: vendorData?.specialist || [],
      logo: logoPreview || "",
      highlight_image: vendorData?.highlight_image || "",
      reference_image: vendorData?.reference_image || [],
      location_map: vendorData?.location_map || "",
    },
  });

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "vendors");
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
    formData.append("folder", "vendors");

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
        form.setValue("logo", "");
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

  async function onSubmit(data: z.infer<typeof VendorSchema>) {
    setLoading(true);
    const res = await updateVendor(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.name} updated successfully!`);
      router.push(`/${locale}/studio/vendor`);
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
              Update Vendor
            </p>
          )}
          <h4 className="text-primary font-semibold ">
            {name ? name : "Update Vendor"}
          </h4>
          <p className="text-sm! text-muted-foreground">{vendorData.slug}</p>
        </div>
        <DeleteCopyFunction
          id={id}
          deleteAction={deleteVendor}
          name={vendorData.name}
          locale={locale}
          resourceType="vendor"
          router={router}
          slug={`${baseUrl}/${locale}/vendor/${vendorData.slug}`}
        />
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
                      Vendor Name
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
              <div className="lg:grid flex flex-col grid-cols-2 gap-5 items-start">
                <div className="space-y-5 w-full">
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
                  <ComboBoxVendor />
                </div>
                <DynamicInputField
                  form={form}
                  name="specialist"
                  label="Vendor Specialist"
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
                  name="highlight_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Highlight Image
                      </FormLabel>
                      {!highlightPreview ? (
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
                    {!referencePreview ? (
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
                          className="hover:bg-muted bg-white rounded-2xl"
                        >
                          <DropzoneEmptyState />
                          <DropzoneContent />
                        </Dropzone>
                      </FormControl>
                    ) : uploadLoadingRFImage ? (
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
                                className="absolute w-10 h-10 top-5 right-2 rounded-full"
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

export default UpdateVendorForm;
