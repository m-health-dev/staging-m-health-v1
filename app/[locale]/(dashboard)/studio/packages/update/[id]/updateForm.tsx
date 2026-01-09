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

import {
  MedicalSchema,
  PackageSchema,
  VendorSchema,
  WellnessSchema,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash, Percent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { DynamicInputField } from "@/components/Form/DynamicInputField";
import { addVendor } from "@/lib/vendors/post-patch-vendor";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  addWellness,
  updateWellness,
} from "@/lib/wellness/post-patch-wellness";

import { Checkbox } from "@/components/ui/checkbox";
import { RupiahInput } from "@/components/Form/PriceInput";
import { WellnessType } from "@/types/wellness.types";
import { ComboBoxGender } from "@/components/Form/ComboBoxGender";
import { ComboBoxVendorListOption } from "@/components/Form/ComboBoxVendorListOption";
import { ComboBoxHotelListOption } from "@/components/Form/ComboBoxHotelListOption";
import { deleteWellness } from "@/lib/wellness/delete-wellness";
import { baseUrl } from "@/helper/baseUrl";
import { MedicalType } from "@/types/medical.types";
import { updateMedical } from "@/lib/medical/post-patch-medical";
import { Studio1DeleteCopyFunction } from "@/components/package-wellness-medical/package-wellness-medical-delete-copy-function";
import { deleteMedical } from "@/lib/medical/delete-medical";
import { PackageType } from "@/types/packages.types";
import { updatePackage } from "@/lib/packages/post-patch-packages";
import { deletePackage } from "@/lib/packages/delete-packages";
import { ComboBoxStatus } from "@/components/Form/ComboBoxStatus";

const UpdatePackageForm = ({
  packageData,
  id,
}: {
  packageData: PackageType;
  id: string;
}) => {
  const [highlightPreview, setHighlightPreview] = useState<string | null>(
    packageData.highlight_image
  );
  const [referencePreview, setReferencePreview] = useState<string[]>(
    packageData.reference_image
  );

  const [loading, setLoading] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState(packageData.id_title || "");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof PackageSchema>>({
    resolver: zodResolver(PackageSchema),
    defaultValues: {
      en_title: packageData?.en_title || "",
      id_title: packageData?.id_title || "",
      en_tagline: packageData?.en_tagline || "",
      id_tagline: packageData?.id_tagline || "",
      highlight_image: packageData?.highlight_image || "",
      reference_image: packageData?.reference_image || [],
      duration_by_day: packageData?.duration_by_day || 0,
      duration_by_night: packageData?.duration_by_night || 0,
      spesific_gender: packageData?.spesific_gender || "",
      en_wellness_package_content:
        packageData?.en_wellness_package_content || "",
      id_wellness_package_content:
        packageData?.id_wellness_package_content || "",
      en_medical_package_content: packageData?.en_medical_package_content || "",
      id_medical_package_content: packageData?.id_medical_package_content || "",
      en_detail: packageData?.en_detail || "",
      id_detail: packageData?.id_detail || "",
      included: packageData?.included || [],
      vendor_id: packageData?.vendor_id || "",
      hotel_id: packageData?.hotel_id || "",
      real_price: Number(packageData?.real_price) || 0,
      discount_price: Number(packageData?.discount_price) || 0,
      status: packageData?.status || "",
    },
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const real = Number(form.getValues("real_price"));
    const disc = Number(form.getValues("discount_price"));

    const handler = setTimeout(() => {
      if (real > 0 && disc > 0) {
        const result = Math.round((disc / real) * 100);
        setPercentage(100 - result);
      } else {
        setPercentage(0);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [form.watch("real_price"), form.watch("discount_price")]);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "packages");
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
    formData.append("folder", "packages/contents");

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
    field: "highlight" | "reference",
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
      if (field === "highlight") {
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

  async function onSubmit(data: z.infer<typeof PackageSchema>) {
    setLoading(true);
    const res = await updatePackage(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.id_title} updated successfully!`);
      router.push(`/${locale}/studio/packages`);
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
              Update Package
            </p>
          )}
          <h4 className="text-primary font-semibold">
            {name ? name : "Update Package"}
          </h4>
          <p className="text-sm! text-muted-foreground">{packageData.slug}</p>
        </div>
        <Studio1DeleteCopyFunction
          id={id}
          deleteAction={deletePackage}
          name={packageData.id_title}
          locale={locale}
          resourceLabel="Package"
          router={router}
          slug={`${baseUrl}/${locale}/package/${packageData.slug}`}
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
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="id_tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Tagline
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
                  name="en_tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Tagline
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
                <div className="grid grid-cols-2 gap-5 items-start w-full">
                  <FormField
                    control={form.control}
                    name="duration_by_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Duration by Day
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="numeric"
                            className="h-12"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value || 0))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration_by_night"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Duration by Night
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="numeric"
                            className="h-12"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value || 0))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <ComboBoxGender />
                </div>
              </div>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <ComboBoxVendorListOption
                  readVendorID={packageData.vendor_id}
                />
                <ComboBoxHotelListOption readHotelID={packageData.hotel_id} />
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
                          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-3">
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

              <DynamicInputField form={form} name="included" label="Included" />

              <hr />
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="id_medical_package_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Medical Content
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
                  name="en_medical_package_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Medical Content
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
                  name="id_wellness_package_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Wellness Content
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
                  name="en_wellness_package_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Wellness Content
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
                  name="id_detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Detail Information
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
                  name="en_detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Detail Information
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
                <RupiahInput
                  control={form.control}
                  name="real_price"
                  label="Real Price"
                />

                <RupiahInput
                  control={form.control}
                  name="discount_price"
                  label="Discount Price"
                />
              </div>

              <div className="font-semibold text-health bg-white px-3 py-1 rounded-full inline-flex w-fit">
                <p className="inline-flex gap-1 items-center">
                  <Percent className="size-5 text-white bg-health rounded-full p-1" />
                  {percentage > 0 ? `${percentage}%` : "0%"}
                </p>
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

export default UpdatePackageForm;
