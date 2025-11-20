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

import {
  emailSchema,
  indonesiaPhoneSchema,
  phoneSchema,
} from "@/lib/zodSchema";
import { PhoneInput } from "@/components/Form/phone-input";
import { Eye, EyeClosed } from "lucide-react";
import { CalendarRangeField } from "@/components/calendar-23";
import Calendar20 from "@/components/calendar-20";

const SandBoxComponents = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [switched, setSwitched] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

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
    isWellness: z.boolean(),
    message: z.string().min(3),
    category: z.string().min(1),
    phone_number: z.string().min(3),
    email: emailSchema,
    password: z.string().min(8),
    // ✅ Tambahan baru
    dateRange: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .optional(),

    meetingDate: z.date().optional(),
    meetingTime: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
      fullname: "",
      referenceImage: [],
      isWellness: false,
      category: "",
      message: "",
      phone_number: "",
      email: "",
      password: "",
      dateRange: undefined,
      meetingDate: undefined,
      meetingTime: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 rounded-md text-wrap wrap-break-word">
          <code className="">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
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
            nostrum voluptates blanditiis. Voluptatem eius quia nisi, iste error
            explicabo, libero animi tempore cum provident amet sed delectus
            inventore magni dolores repellat.
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
                variant="outline"
                size={"sm"}
                onClick={() => toast.success("Event has been created")}
              >
                Success
              </Button>
              <Button
                variant="outline"
                size={"sm"}
                onClick={() =>
                  toast.info("Be at the area 10 minutes before the event time")
                }
              >
                Info
              </Button>
              <Button
                variant="outline"
                size={"sm"}
                onClick={() =>
                  toast.warning("Event start time cannot be earlier than 8am")
                }
              >
                Warning
              </Button>
              <Button
                variant="outline"
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
        </div>
        <div className="space-y-5">
          <h3 className="font-bold text-primary mb-16">Input</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid lg:grid-cols-2 gap-5"
              autoComplete="off"
            >
              <div className="space-y-5">
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
              </div>

              <div className="space-y-5">
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
                          onDrop={(acceptedFiles) => {
                            field.onChange(acceptedFiles);
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

                <ComboBoxField />
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
              </div>

              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      Meeting Schedule
                    </FormLabel>
                    <FormControl>
                      <Calendar20
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

              <Button type="submit" className="rounded-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default SandBoxComponents;
