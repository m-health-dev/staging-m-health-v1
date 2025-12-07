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
import { RupiahInput } from "@/components/Form/PriceInput";
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
    formData.append("field", "referenceImage");

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
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
    fullname: z.string().min(3, {
      message: "You must add minimal 3 character.",
    }),
    referenceImage: z
      .custom<File[]>()
      .refine(
        (files) => files && files.length > 0,
        "Reference image is required"
      ),
    checklist: z.array(z.string()).min(1, "Please select at least one"),
    isWellness: z.boolean(),
    message: z.string().min(3),
    category: z.string().min(1),
    phone_number: z.string().min(3),
    email: emailSchema,
    password: z.string().min(8),
    // price: createRupiahSchema({ min: 1000, max: 1000000000, label: "Price" }),
    dateRange: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .optional(),

    meetingDate: z.date().optional(),
    meetingTime: z.string().optional(),
    content: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
      fullname: "",
      referenceImage: [],
      checklist: [],
      isWellness: false,
      category: "",
      message: "",
      phone_number: "",
      // price: "",
      email: "",
      password: "",
      dateRange: undefined,
      meetingDate: undefined,
      meetingTime: "",
      content: "",
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
      {annCat === "info" && (
        <div className="bg-blue-100">
          <ContainerWrap className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-2 py-4">
            <p className="font-semibold text-primary gap-2 inline-flex items-center text-base!">
              <Info className="size-4" />
              Informasi
            </p>
            <p className="lg:text-sm! text-xs!">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              perferendis repudiandae quaerat, voluptatum adipisci atque fugit
              laudantium id maxime culpa non natus dolores? Itaque pariatur
              voluptate illum temporibus doloremque voluptates!
            </p>
          </ContainerWrap>
        </div>
      )}
      {annCat === "warning" && (
        <div className="bg-yellow-100">
          <ContainerWrap className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-2 py-4">
            <p className="font-semibold text-yellow-600 gap-2 inline-flex items-center text-base!">
              <TriangleAlert className="size-4" />
              Pemberitahuan
            </p>
            <p className="lg:text-sm! text-xs!">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              perferendis repudiandae quaerat, voluptatum adipisci atque fugit
              laudantium id maxime culpa non natus dolores? Itaque pariatur
              voluptate illum temporibus doloremque voluptates!
            </p>
          </ContainerWrap>
        </div>
      )}
      {annCat === "danger" && (
        <div className="bg-red-100">
          <ContainerWrap className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-2 py-4">
            <p className="font-semibold text-red-600 gap-2 inline-flex items-center text-base!">
              <OctagonAlert className="size-4" />
              Peringatan
            </p>
            <p className="lg:text-sm! text-xs!">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              perferendis repudiandae quaerat, voluptatum adipisci atque fugit
              laudantium id maxime culpa non natus dolores? Itaque pariatur
              voluptate illum temporibus doloremque voluptates!
            </p>
          </ContainerWrap>
        </div>
      )}
      <Wrapper>
        <ContainerWrap size="lg" className="space-y-20 my-20">
          <div className="space-y-5">
            <h3 className="font-bold text-primary mb-16">Typography</h3>
            <h1 className="font-bold">H1 : Lorem Ipsum Dolor Sit Atmet</h1>
            <h2 className="font-bold">H2 : Lorem Ipsum Dolor Sit Atmet</h2>
            <h3 className="font-bold">H3 : Lorem Ipsum Dolor Sit Atmet</h3>
            <h4 className="font-bold">H4 : Lorem Ipsum Dolor Sit Atmet</h4>
            <h5 className="font-bold">H5 : Lorem Ipsum Dolor Sit Atmet</h5>
            <h6 className="font-bold">H6 : Lorem Ipsum Dolor Sit Atmet</h6>
            <p>
              Paragraph : Lorem ipsum dolor sit, amet consectetur adipisicing
              elit. Pariatur vel minima enim magnam{" "}
              <span className="underline decoration-primary text-primary decoration-2">
                itaque inventore
              </span>{" "}
              vitae expedita nam officiis nisi error <i>nobis voluptate</i> quas
              iusto deleniti quos accusantium sequi excepturi earum, blanditiis
              laborum corrupti rem obcaecati explicabo.{" "}
              <strong>Nulla corporis</strong>, iure voluptatibus laudantium
              perferendis optio. Incidunt alias labore nisi adipisci maiores!
            </p>
            <ul className="list-inside list-disc">
              <li>Lorem ipsum dolor sit.</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing.</li>
              <li>Lorem, ipsum dolor.</li>
            </ul>
            <ol className="list-inside list-decimal">
              <li>Lorem ipsum dolor sit.</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing.</li>
              <li>Lorem, ipsum dolor.</li>
            </ol>
            <pre className="bg-primary/10 p-4 rounded-2xl text-wrap">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
              temporibus, adipisci laudantium officiis veniam et ab! Vitae eum
              nostrum voluptates blanditiis. Voluptatem eius quia nisi, iste
              error explicabo, libero animi tempore cum provident amet sed
              delectus inventore magni dolores repellat.
            </pre>
            <div className="border-l-3 border-primary pl-5 py-1">
              <p className="text-muted-foreground italic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
                error voluptatem, exercitationem a temporibus natus officiis
                debitis eum illo ipsa culpa esse vel cum enim.
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="font-bold text-primary mb-16">Action</h3>
            <div className="flex flex-wrap gap-5">
              <div>
                <p className="text-sm! text-muted-foreground mb-2">
                  Large Button
                </p>
                <Button size={"lg"} className="rounded-full">
                  <p>Daftar Sekarang</p>
                </Button>
              </div>

              <div>
                <p className="text-sm! text-muted-foreground mb-2">
                  Regular Button
                </p>
                <Button className="rounded-full bg-health hover:bg-health/90 focus:bg-health/90">
                  <p>Daftar Sekarang</p>
                </Button>
              </div>

              <div>
                <p className="text-sm! text-muted-foreground mb-2">
                  Small Button
                </p>
                <Button size={"sm"} className="rounded-full">
                  <p className="text-sm!">Daftar Sekarang</p>
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm! text-muted-foreground mb-2">
                Toast/ Notification
              </p>
              <div className="flex flex-wrap gap-5 *:rounded-full">
                <Button
                  variant="outline"
                  size={"sm"}
                  onClick={() => toast("Event has been created")}
                >
                  Default
                </Button>
                <Button
                  className="bg-green-100 text-green-600 border border-green-500 hover:bg-green-500 hover:text-white"
                  size={"sm"}
                  onClick={() => toast.success("Event has been created")}
                >
                  Success
                </Button>
                <Button
                  className="bg-blue-100 text-blue-600  border border-blue-500 hover:bg-blue-500 hover:text-white"
                  size={"sm"}
                  onClick={() =>
                    toast.info(
                      "Be at the area 10 minutes before the event time"
                    )
                  }
                >
                  Info
                </Button>
                <Button
                  className="bg-yellow-100 text-yellow-600  border border-yellow-500 hover:bg-yellow-500 hover:text-white"
                  size={"sm"}
                  onClick={() =>
                    toast.warning("Event start time cannot be earlier than 8am")
                  }
                >
                  Warning
                </Button>
                <Button
                  className="bg-red-100 text-red-600  border border-red-500 hover:bg-red-500 hover:text-white"
                  size={"sm"}
                  onClick={() => toast.error("Event has not been created")}
                >
                  Error
                </Button>
                <Button
                  variant="outline"
                  size={"sm"}
                  onClick={() => {
                    toast.promise<{ name: string }>(
                      () =>
                        new Promise((resolve) =>
                          setTimeout(() => resolve({ name: "Event" }), 2000)
                        ),
                      {
                        loading: "Loading...",
                        success: (data) => `${data.name} has been created`,
                        error: "Error",
                      }
                    );
                  }}
                >
                  Promise
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm! text-muted-foreground mb-2">Tooltip</p>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size={"sm"} className="rounded-full">
                      Hover
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-base">
                    Add to library
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div>
              <p className="text-sm! text-muted-foreground mb-2">
                Announcement (Top of Page)
              </p>
              <div className="flex flex-wrap gap-5 *:rounded-full">
                <Button
                  className="bg-blue-100 text-blue-600  border border-blue-500 hover:bg-blue-500 hover:text-white"
                  size={"sm"}
                  onClick={() => {
                    setAnnCat("info");
                    window.scrollTo(0, 0);
                  }}
                >
                  Info
                </Button>
                <Button
                  className="bg-yellow-100 text-yellow-600  border border-yellow-500 hover:bg-yellow-500 hover:text-white"
                  size={"sm"}
                  onClick={() => {
                    setAnnCat("warning");
                    window.scrollTo(0, 0);
                  }}
                >
                  Warning
                </Button>
                <Button
                  className="bg-red-100 text-red-600  border border-red-500 hover:bg-red-500 hover:text-white"
                  size={"sm"}
                  onClick={() => {
                    setAnnCat("danger");
                    window.scrollTo(0, 0);
                  }}
                >
                  Danger
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="font-bold text-primary mb-16">Input</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid lg:grid-cols-2 grid-cols-1 gap-5"
                autoComplete="off"
              >
                <div className="space-y-5">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <PhoneInput defaultCountry="ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* OTP */}
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          One-Time Password
                        </FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Please enter the one-time password sent to your phone.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-full h-12">
                            <Input
                              {...field}
                              type={`${showPass ? "text" : "password"}`}
                              className="h-12"
                            />
                            <div className="absolute right-4 top-0 flex min-h-full items-center">
                              {showPass ? (
                                <EyeClosed
                                  className="size-5 text-primary"
                                  onClick={() => setShowPass(false)}
                                />
                              ) : (
                                <Eye
                                  className="size-5 text-primary"
                                  onClick={() => setShowPass(true)}
                                />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date Range */}
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Date Range
                        </FormLabel>
                        <FormControl>
                          <CalendarRangeField
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checklist */}
                  <FormField
                    control={form.control}
                    name="checklist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Select Categories
                        </FormLabel>

                        <div className="space-y-2">
                          {[
                            { id: "design", label: "Design" },
                            { id: "development", label: "Development" },
                            { id: "marketing", label: "Marketing" },
                          ].map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-3"
                                >
                                  <Checkbox
                                    id={item.id}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value: string) =>
                                                value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                </div>
                              </FormControl>
                            </FormItem>
                          ))}
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-5">
                  {/* Switch */}
                  <FormField
                    control={form.control}
                    name="isWellness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Switch
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label
                              className={cn(
                                field.value
                                  ? "bg-green-100 text-green-600 border border-green-200"
                                  : "bg-yellow-100 text-yellow-600 border border-yellow-200",
                                "px-3 py-1 rounded-full text-xs!"
                              )}
                            >
                              {field.value
                                ? "is Wellness Product"
                                : "is Not Wellness Product"}
                            </Label>
                          </div>
                        </FormControl>
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
                            maxSize={1024 * 1024 * 2}
                            maxFiles={5}
                            src={field.value}
                            onDrop={async (acceptedFiles) => {
                              field.onChange(acceptedFiles);

                              const url = await handleImageUpload(
                                acceptedFiles
                              );

                              if (url) {
                                form.setValue("referenceImage", [url]); // simpan URL bukan File
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

                  {/* Combobox */}
                  <ComboBoxField />

                  {/* TextArea */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Your Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Type your message here."
                            className="min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price
                  <RupiahInput
                    control={form.control}
                    name="price"
                    label="Price"
                  /> */}
                </div>

                <div className="lg:col-span-2 col-span-1">
                  {/* Schedule */}
                  <FormField
                    control={form.control}
                    name="meetingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Meeting Schedule
                        </FormLabel>
                        <FormControl>
                          <CalendarSchedule
                            selectedDate={field.value}
                            onDateChange={(date) => field.onChange(date)}
                            selectedTime={form.watch("meetingTime")}
                            onTimeChange={(time) =>
                              form.setValue("meetingTime", time)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="lg:col-span-2 col-span-1">
                  {/* Rich Text */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          Content
                        </FormLabel>
                        <FormControl>
                          <RichEditor {...field} />
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
