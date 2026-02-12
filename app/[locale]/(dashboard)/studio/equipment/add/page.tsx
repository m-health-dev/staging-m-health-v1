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
  EquipmentSchema,
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
import { addWellness } from "@/lib/wellness/post-patch-wellness";
import { ComboBoxVendorListOption } from "../ComboBoxVendorListOption";
import { ComboBoxHotelListOption } from "../ComboBoxHotelListOption";
import { ComboBoxGender } from "../ComboBoxGender";
import { Checkbox } from "@/components/ui/checkbox";
import { RupiahInput } from "@/components/Form/PriceInput";
import { addMedical } from "@/lib/medical/post-patch-medical";
import { addPackage } from "@/lib/packages/post-patch-packages";
import { ComboBoxStatus } from "@/components/Form/ComboBoxStatus";
import { addMedicalEquipment } from "@/lib/medical-equipment/post-patch-medical-equipment";

const AddPackage = () => {
  const [highlightPreview, setHighlightPreview] = useState<string | null>(null);
  const [referencePreview, setReferencePreview] = useState<string[]>([]);

  // Error states untuk gambar yang gagal dimuat
  const [highlightError, setHighlightError] = useState(false);
  const [referenceErrors, setReferenceErrors] = useState<{
    [key: number]: boolean;
  }>({});

  const [loading, setLoading] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof EquipmentSchema>>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues: {
      en_title: "",
      id_title: "",
      spesific_gender: "",
      highlight_image: "",
      reference_image: [],
      en_description: "",
      id_description: "",
      vendor_id: "",
      real_price: 0,
      discount_price: 0,
      status: "",
    },
  });

  const [percentage, setPercentage] = useState(0);

  const watchRealPrice = form.watch("real_price");
  const watchDiscountPrice = form.watch("discount_price");

  useEffect(() => {
    const real = Number(watchRealPrice);
    const disc = Number(watchDiscountPrice);

    const handler = setTimeout(() => {
      if (real > 0 && disc > 0) {
        const result = Math.round((disc / real) * 100);
        setPercentage(100 - result);
      } else {
        setPercentage(0);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [watchRealPrice, watchDiscountPrice]);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "equipment");
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
    formData.append("folder", "equipment/contents");

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
    field: "highlight" | "reference",
    index?: number,
  ) {
    setLoading(true);

    setDeletedImages((prev) => [...prev, url]);

    // Optimistic UI update
    if (field === "highlight") {
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
          field === "highlight"
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

  async function onSubmit(data: z.infer<typeof EquipmentSchema>) {
    setLoading(true);
    const res = await addMedicalEquipment(data);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.id_title} added successfully!`);
      router.push(`/${locale}/studio/equipment`);
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
            Add Equipment
          </p>
        )}
        <h4 className="text-primary font-semibold">
          {name ? name : "Add Equipment"}
        </h4>
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
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <div>
                  <ComboBoxGender />
                </div>
                <ComboBoxVendorListOption />
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
                      <FormDescription>
                        Rekomendasi: Aspek Rasio 1:1. (Ex. 1080x1080px /
                        720x720px). Max. 5MB
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
                <FormField
                  control={form.control}
                  name="reference_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Reference Images
                      </FormLabel>
                      <FormDescription>
                        Rekomendasi: Aspek Rasio 1:1. (Ex. 1080x1080px /
                        720x720px). Max. 5MB
                      </FormDescription>
                      {uploadLoadingRFImage ? (
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-3">
                          <Skeleton className="aspect-square w-full rounded-2xl object-cover border" />
                          <Skeleton className="aspect-square w-full rounded-2xl object-cover border" />
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
                            className="hover:bg-muted bg-white rounded-2xl w-full"
                          >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>
                        </FormControl>
                      ) : (
                        referencePreview && (
                          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-3">
                            {referencePreview.map((url, i) =>
                              referenceErrors[i] ? (
                                <div key={url} className="relative">
                                  <div className="text-red-500 text-sm mb-2">
                                    Gambar gagal dimuat. Silakan upload ulang.
                                  </div>
                                  <Dropzone
                                    accept={{ "image/*": [] }}
                                    maxSize={1024 * 1024 * 5}
                                    onDrop={async (acceptedFiles) => {
                                      setUploadLoadingRFImage(true);
                                      setReferenceErrors((prev) => ({
                                        ...prev,
                                        [i]: false,
                                      }));
                                      const urls =
                                        await handleBatchImageUpload(
                                          acceptedFiles,
                                        );

                                      if (urls && urls.length > 0) {
                                        const newPreview = [
                                          ...referencePreview,
                                        ];
                                        newPreview[i] = urls[0];
                                        setReferencePreview(newPreview);
                                        form.setValue(
                                          "reference_image",
                                          newPreview,
                                        );
                                        setUploadLoadingRFImage(false);
                                      }
                                    }}
                                    onError={console.error}
                                    className="hover:bg-muted bg-white rounded-2xl w-full"
                                  >
                                    <DropzoneEmptyState />
                                    <DropzoneContent />
                                  </Dropzone>
                                </div>
                              ) : (
                                <div key={url} className="relative">
                                  <Image
                                    src={url}
                                    width={320}
                                    height={320}
                                    alt={url}
                                    className="aspect-square w-full rounded-2xl mt-3 object-cover border"
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
                                      await handleBatchImageUpload(
                                        acceptedFiles,
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
                                  className="hover:bg-muted bg-white rounded-2xl w-full mt-3"
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
                        Indonesian Information
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
                        English Information
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
                  disabled={loading}
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

export default AddPackage;
