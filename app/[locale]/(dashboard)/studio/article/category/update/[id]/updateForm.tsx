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
  ArticleAuthorSchema,
  ArticleCategorySchema,
  EventSchema,
} from "@/lib/zodSchema";
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
import { ArticleAuthorType, ArticleCategoryType } from "@/types/articles.types";
import { updateArticleAuthor } from "@/lib/article-author/post-patch-article-author";
import { ComboBoxArticleAuthorJob } from "@/components/Form/ComboBoxArticleAuthorJob";
import { updateArticleCategory } from "@/lib/article-category/post-patch-article-category";
import { Textarea } from "@/components/ui/textarea";

type UpdateForm = {
  id: string;
  data: ArticleCategoryType;
};

const UpdateArticleCategoryForm = ({ id, data }: UpdateForm) => {
  // const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
  //   data.profile_image
  // );

  const [loading, setLoading] = useState(false);
  // const [uploadLoadingProfileImage, setUploadLoadingProfileImage] =
  //   useState(false);
  // const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [name, setName] = useState(data.id_category || "");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof ArticleCategorySchema>>({
    resolver: zodResolver(ArticleCategorySchema),
    defaultValues: {
      id_category: data.id_category || "",
      en_category: data.en_category || "",
      id_description: data.id_description || "",
      en_description: data.en_description || "",
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

  // async function handleImageUpload(files: File[]) {
  //   const formData = new FormData();
  //   formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
  //   formData.append("model", "article/author");
  //   // formData.append("field", "referenceImage");

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Uploaded:", data);

  //     if (data.url) {
  //       toast.success("Image uploaded!", {
  //         description: `${data.url}`,
  //       });
  //     }

  //     return data.url;
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Upload failed", { description: `${error}` });
  //   }
  // }

  // async function handleBatchImageUpload(files: File[]) {
  //   const formData = new FormData();
  //   files.forEach((file) => formData.append("file", file));
  //   formData.append("folder", "events/contents");

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload/batch`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Uploaded:", data);

  //     if (data.url) {
  //       toast.success("Image uploaded!", {
  //         description: `${data}`,
  //       });
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Upload failed", { description: `${error}` });
  //   }
  // }

  // async function handleDelete(
  //   url: string,
  //   field: "profile_image" | "reference",
  //   index?: number
  // ) {
  //   setLoading(true);
  //   const deletedPath = url; // url relative yg dikirim ke API

  //   setDeletedImages((prev) => [...prev, deletedPath]); // ⬅ tambahkan ini

  //   const res = await fetch("/api/image/delete", {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ path: url }),
  //   });

  //   const data = await res.json();

  //   if (data.message) {
  //     setLoading(false);
  //     if (field === "profile_image") {
  //       setProfileImagePreview(null);
  //       form.setValue("profile_image", "");
  //       toast.success("Profile Image Deleted!");

  //       // }  else if (field === "reference") {
  //       //   setReferencePreview((prev) => {
  //       //     const newArr = prev.filter((_, i) => i !== index);
  //       //     form.setValue("reference_image", newArr);
  //       //     return newArr;
  //       //   });
  //       toast.success("Referenced Image Deleted!");
  //     }
  //   } else {
  //     setLoading(false);
  //     toast.error(data.error || "Failed to delete");
  //   }
  // }

  async function onSubmit(data: z.infer<typeof ArticleCategorySchema>) {
    setLoading(true);
    const res = await updateArticleCategory(data, id);

    if (res.success) {
      setLoading(false);
      toast.success(`${data.id_category} updated successfully!`);
      router.push(`/${locale}/studio/article/category`);
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
              Update Author
            </p>
          )}
          <h4 className="text-primary font-semibold">
            {name ? name : "Update Author"}
          </h4>
        </div>
        <Studio1DeleteCopyFunction
          id={id}
          deleteAction={deleteEvent}
          name={data.id_category}
          locale={locale}
          resourceLabel="Category"
          router={router}
          slug={`${baseUrl}/${locale}/article?category=${
            locale === "id" ? data.id_category : data.en_category
          }`}
        />
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-5">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-start w-full">
                <FormField
                  control={form.control}
                  name="id_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Category Name
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
                  name="en_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        English Category Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="h-12" />
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
                  name="id_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Indonesian Short Description
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-32" />
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
                        English Short Description
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-32" />
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

export default UpdateArticleCategoryForm;
