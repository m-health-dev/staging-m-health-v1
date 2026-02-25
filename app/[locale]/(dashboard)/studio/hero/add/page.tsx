"use client";

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
import { HeroSchema, HotelSchema, VendorSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, Trash } from "lucide-react";
import React, { useState } from "react";
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
import { addHero } from "@/lib/hero/post-patch-hero";
import { Switch } from "@/components/ui/switch";

const AddHero = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Error state untuk gambar yang gagal dimuat
  const [imageError, setImageError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingImage, setUploadLoadingImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof HeroSchema>>({
    resolver: zodResolver(HeroSchema),
    defaultValues: {
      title: "",
      image: "",
      link: "",
      display_order: "",
      is_active: true,
    },
  });

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "hero");
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

  async function handleDelete(url: string, field: "image", index?: number) {
    setLoading(true);

    setDeletedImages((prev) => [...prev, url]);

    // Optimistic UI update
    if (field === "image") {
      setImagePreview(null);
      form.setValue("image", "");
    }

    try {
      const res = await fetch("/api/image/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: url }),
      });

      const data = await res.json();

      if (data.message) {
        toast.success("Image Deleted!");
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

  async function onSubmit(data: z.infer<typeof HeroSchema>) {
    setLoading(true);
    const res = await addHero(data);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.title} hero banner added successfully!`);
      router.push(`/${locale}/studio/hero`);
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
            Add Hero Banner
          </p>
        )}
        <h4 className="text-primary font-semibold">
          {name ? name : "Add Hero Banner"}
        </h4>
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-5">
              <div className="lg:grid flex flex-col grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Hero Title
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
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Link
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="url" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <hr />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      Hero Image
                    </FormLabel>
                    {uploadLoadingImage ? (
                      <Skeleton className="aspect-20/7 w-full rounded-2xl mt-3 object-cover border" />
                    ) : imagePreview === null || imageError ? (
                      <FormControl>
                        <div>
                          {imageError && (
                            <div className="text-red-500 text-sm mb-2">
                              Gagal memuat gambar. Silakan upload ulang.
                            </div>
                          )}
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            onDrop={async (acceptedFiles) => {
                              setUploadLoadingImage(true);
                              setImageError(false);
                              const url =
                                await handleImageUpload(acceptedFiles);

                              if (url) {
                                form.setValue("image", url);
                                setImagePreview(url);
                                setUploadLoadingImage(false);
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
                      imagePreview && (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            width={720}
                            height={720}
                            alt={imagePreview}
                            className="aspect-20/7 w-full rounded-2xl mt-3 object-cover border"
                            onError={() => setImageError(true)}
                          />
                          <Button
                            size="sm"
                            type="button"
                            variant={"destructive_outline"}
                            onClick={() =>
                              handleDelete(
                                imagePreview.replace(
                                  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                  "",
                                ),
                                "image",
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
              <hr />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      Display Order
                    </FormLabel>
                    <FormDescription>
                      Lower numbers appear first. Please use just between 1 to 5
                    </FormDescription>
                    <FormControl>
                      <Input {...field} type="number" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      Active
                    </FormLabel>
                    <FormDescription>
                      Toggle whether this hero banner is visible.
                    </FormDescription>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

export default AddHero;
