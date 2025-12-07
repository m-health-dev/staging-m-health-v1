"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

type Announcement = "info" | "warning" | "danger";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

const SandBoxComponents = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [switched, setSwitched] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<
    { url: string; path: string }[]
  >([]);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("folder", "sandbox");

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
        toast.success("Image uploaded!");
      }

      return data.url; // <= kembalikan public url
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  }

  async function handleDelete(path: string) {
    const res = await fetch("/api/image/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "x-api-key": process.env.NEXT_PUBLIC_S3_CLIENT_TOKEN!, // TOKEN UNTUK CLIENT
      },
      body: JSON.stringify({ path }),
    });

    const data = await res.json();

    if (data.message) {
      setUploadedImages((prev) => prev.filter((img) => img.path !== path));
      toast.success("Image deleted");
    } else {
      toast.error(data.error || "Failed to delete");
    }
  }

  const FormSchema = z.object({
    fullname: z.string().min(3, {
      message: "You must add minimal 3 character.",
    }),
    referenceImage: z.url().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      referenceImage: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 rounded-md text-wrap wrap-anywhere line-clamp-30">
          <code className="">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const [annCat, setAnnCat] = useState<Announcement>("info");

  return (
    <>
      <Wrapper>
        <ContainerWrap size="lg" className="space-y-20 my-20">
          <div className="space-y-5">
            <h3 className="font-bold text-primary mb-16">Input</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid lg:grid-cols-2 grid-cols-1 gap-5"
                autoComplete="off"
              >
                <div className="space-y-5">
                  {/* Normal String */}
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12" />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="referenceImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Reference Image
                        </FormLabel>

                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxSize={1024 * 1024 * 5}
                            maxFiles={5}
                            src={[]} // 👈 FIX: jangan pakai field.value
                            onDrop={async (acceptedFiles) => {
                              const url = await handleImageUpload(
                                acceptedFiles
                              );

                              if (url) {
                                form.setValue("referenceImage", url); // 👈 simpan URL saja
                              }
                            }}
                            onError={console.error}
                            className="hover:bg-muted bg-white rounded-2xl"
                          >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((img) => (
                      <div
                        key={img.path}
                        className="border rounded-xl overflow-hidden relative"
                      >
                        <img
                          src={img.url}
                          alt="uploaded"
                          className="w-full h-40 object-cover"
                        />

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(img.path)}
                          className="absolute top-2 right-2 rounded-full"
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 col-span-1 w-full mt-5">
                  <Button type="submit" className="rounded-full flex w-full">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ContainerWrap>
      </Wrapper>
    </>
  );
};

export default SandBoxComponents;
