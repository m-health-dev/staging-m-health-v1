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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { ComboBoxField } from "@/components/Form/ComboBox";

import { emailSchema, phoneSchema } from "@/lib/zodSchema";
import { PhoneInput } from "@/components/Form/phone-input";
import {
  Eye,
  EyeClosed,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { CalendarRangeField } from "@/components/Form/CalendarRangeField";
import CalendarSchedule from "@/components/Form/CalendarSchedule";
import { RichEditor } from "@/components/Form/RichEditor";
import { createRupiahSchema, RupiahInput } from "@/components/Form/PriceInput";
import { Checkbox } from "@/components/ui/checkbox";

type Announcement = "info" | "warning" | "danger";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

const SandBoxComponents = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [switched, setSwitched] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "sandbox");
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
        toast.success("Image uploaded!");
      }

      return data.url; // <= kembalikan public url
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
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
