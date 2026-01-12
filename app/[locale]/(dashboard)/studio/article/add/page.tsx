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

import { ArticleSchema } from "@/lib/zodSchema";
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

import { ComboBoxStatus } from "@/components/Form/ComboBoxStatus";
import { addArticles } from "@/lib/articles/post-patch-articles";
import { ComboBoxArticleAuthorJob } from "@/components/Form/ComboBoxArticleAuthorJob";
import { AuthorMultiSelectField } from "../ComboBoxAuthor";
import { CategoryMultiSelectField } from "../ComboBoxCategory";

const AddPackage = () => {
  const [highlightPreview, setHighlightPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingHLImage, setUploadLoadingHLImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof ArticleSchema>>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      en_title: "",
      id_title: "",
      en_content: "",
      id_content: "",
      highlight_image: "",
      author: [],
      category: [],
      status: "",
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
      }
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to delete");
    }
  }

  async function onSubmit(data: z.infer<typeof ArticleSchema>) {
    setLoading(true);
    const res = await addArticles(data);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.id_title} added successfully!`);
      router.push(`/${locale}/studio/article`);
    } else if (res.error) {
      setLoading(false);
      toast.error(res.error);
    }
  }

  return (
    <ContainerWrap className="pb-20">
      <div className="my-10 sticky top-0 bg-linear-to-b from-background via-background z-10 w-full py-5">
        {name && (
          <p className="bg-health inline-flex text-white px-2 rounded-md text-sm! py-1">
            Add Article
          </p>
        )}
        <h4 className="text-primary font-semibold">
          {name ? name : "Add Article"}
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
              <hr />
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <AuthorMultiSelectField />
                <CategoryMultiSelectField />
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
                    ) : highlightPreview === null ? (
                      <FormControl>
                        <Dropzone
                          accept={{ "image/*": [] }}
                          maxSize={1024 * 1024 * 5}
                          onDrop={async (acceptedFiles) => {
                            setUploadLoadingHLImage(true);
                            const url = await handleImageUpload(acceptedFiles);

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
                                  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
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

              <hr />
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
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
