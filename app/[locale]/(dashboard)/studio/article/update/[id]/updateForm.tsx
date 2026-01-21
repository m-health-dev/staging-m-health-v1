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
  ArticleSchema,
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

import { deleteWellness } from "@/lib/wellness/delete-wellness";
import { baseUrl } from "@/helper/baseUrl";
import { MedicalType } from "@/types/medical.types";
import { updateMedical } from "@/lib/medical/post-patch-medical";
import { Studio1DeleteCopyFunction } from "@/components/package-wellness-medical/package-wellness-medical-delete-copy-function";

import { ComboBoxStatus } from "@/components/Form/ComboBoxStatus";
import { ArticleType } from "@/types/articles.types";
import { updateArticles } from "@/lib/articles/post-patch-articles";
import { deleteArticles } from "@/lib/articles/delete-articles";
import { AuthorMultiSelectField } from "../../ComboBoxAuthor";
import { CategoryMultiSelectField } from "../../ComboBoxCategory";

const UpdateArticleForm = ({ data, id }: { data: ArticleType; id: string }) => {
  const [highlightPreview, setHighlightPreview] = useState<string | null>(
    data.highlight_image,
  );

  // Error state untuk gambar yang gagal dimuat
  const [highlightError, setHighlightError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);

  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState(data.id_title || "");
  const router = useRouter();
  const locale = useLocale();

  const authorIds = (data.author ?? []).map((a: any) =>
    typeof a === "string" ? a : a?.id,
  );
  const categoryIds = (data.category ?? []).map((c: any) =>
    typeof c === "string" ? c : c?.id,
  );

  const form = useForm<z.infer<typeof ArticleSchema>>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      en_title: data.en_title || "",
      id_title: data.id_title || "",
      en_content: data.en_content || "",
      id_content: data.id_content || "",
      highlight_image: data.highlight_image || "",
      author: authorIds,
      category: categoryIds,
      status: data.status || "",
    },
  });

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "article/contents");
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
    field: "highlight" | "reference",
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
      if (field === "highlight") {
        setHighlightPreview(null);
        form.setValue("highlight_image", "");
        toast.success("Highlight Image Deleted!");
      }
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to delete");
    }
  }

  async function onSubmit(data: z.infer<typeof ArticleSchema>) {
    setLoading(true);
    const res = await updateArticles(data, id);
    if (res.success) {
      setLoading(false);
      toast.success(`${data.id_title} updated successfully!`);
      router.push(`/${locale}/studio/article`);
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }

  // const authorIds = data.author.map((authorId) => authorId.id);

  return (
    <ContainerWrap className="pb-20">
      <div className="my-10 sticky top-0 bg-linear-to-b from-background via-background z-10 w-full py-5 flex lg:flex-row flex-col justify-between lg:items-center gap-3">
        <div>
          {name && (
            <p className="bg-health inline-flex text-white px-2 rounded-md text-sm! py-1">
              Update Article
            </p>
          )}
          <h4 className="text-primary font-semibold line-clamp-2">
            {name ? name : "Update Article"}
          </h4>
          <p className="text-sm! text-muted-foreground line-clamp-2">
            {data.slug}
          </p>
        </div>
        <Studio1DeleteCopyFunction
          id={id}
          deleteAction={deleteArticles}
          name={data.id_title}
          locale={locale}
          resourceLabel="Article"
          router={router}
          slug={`${baseUrl}/${locale}/article/${data.slug}`}
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
                <AuthorMultiSelectField readAuthorIds={authorIds} />
                <CategoryMultiSelectField readCategoryIds={categoryIds} />
              </div>
              <hr />

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
                    ) : highlightPreview === null || highlightError ? (
                      <FormControl>
                        <div>
                          {highlightError && (
                            <div className="text-sm text-red-500 mb-2">
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
                            width={1920}
                            height={1080}
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
                                  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
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

              <hr />
              <div className="flex flex-col gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="id_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Content
                      </FormLabel>
                      <FormControl>
                        <RichEditor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <hr />

                <FormField
                  control={form.control}
                  name="en_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Content
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

export default UpdateArticleForm;
