"use client";

import React, { useState } from "react";
import { CalendarRangeField } from "@/components/Form/CalendarRangeField";
import CalendarSchedule from "@/components/Form/CalendarSchedule";
import { ComboBoxField } from "@/components/Form/ComboBox";
import { PhoneInput } from "@/components/Form/phone-input";
import { RupiahInput } from "@/components/Form/PriceInput";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { cn } from "@/lib/utils";
import { emailSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Switch } from "@radix-ui/react-switch";
import { EyeClosed, Eye, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Label } from "recharts";
import { toast } from "sonner";
import z from "zod";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Button } from "@/components/ui/button";
import CalendarDatePicker from "@/components/Form/CalendarDatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CalendarScheduleFull from "@/components/Form/CalendarScheduleFull";
import { baseUrl } from "@/helper/baseUrl";
import { signUpAction } from "../../(auth)/actions/auth.actions";
import { nanoid } from "nanoid";
import { sendMail } from "@/lib/mail/send-mail";
import { Account } from "@/types/account.types";
import { getAgeDetail } from "@/helper/getAge";
import { generatePassword } from "@/helper/getPassword";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";

type Step = 1 | 2 | 3;

const fieldsPerStep = {
  1: ["complaint", "reference_image"] as const,
  2: [
    "phone_number",
    "email",
    "fullname",
    "height",
    "weight",
    "gender",
    "location",
  ] as const,
  3: ["scheduled_datetime"] as const,
} as const;

const CWDComponent = ({
  accounts,
  publicID,
  dateBooked,
  chatSession,
  checkSession,
  locale,
  labels,
}: {
  accounts?: Account;
  publicID: string;
  dateBooked?: { scheduled_datetime: string }[] | null;
  chatSession?: string;
  checkSession?: boolean;
  locale: string;
  labels?: any;
}) => {
  // console.log(dateBooked);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [referencePreview, setReferencePreview] = useState<string[]>([]);
  const domicile = parseDomicile(accounts?.domicile);

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>(1);

  const fieldsPerStep = {
    1: ["complaint", "reference_image"] as const,
    2: [
      "phone_number",
      "email",
      "fullname",
      "height",
      "weight",
      "gender",
      "location",
    ] as const,
    3: ["scheduled_datetime"] as const,
  } as const;
  async function handleNext() {
    const fields = fieldsPerStep[currentStep];

    const isValid = await form.trigger(fields as any);

    if (!isValid) {
      toast.error("Please complete all required fields.");
      return;
    }

    setCurrentStep((prev) => (prev + 1) as Step);
  }

  function handleBack() {
    setCurrentStep((prev) => (prev - 1) as Step);
  }

  async function handleBatchImageUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("folder", "consults");

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
    field: "logo" | "highlight" | "reference",
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
      if (field === "reference") {
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

  const FormSchema = z.object({
    chat_session: z.string().min(8),
    phone_number: z.string().min(3),
    email: emailSchema,
    fullname: z.string().min(1),
    complaint: z.string().min(3),
    date_of_birth: z.date(),
    height: z.string().min(1).max(3),
    weight: z.string().min(1).max(3),
    gender: z.string().min(1),
    scheduled_datetime: z.date(),
    reference_image: z.array(z.string()).optional(),
    domicile_city: z.string().optional(),
    domicile_district: z.string().optional(),
    domicile_address: z.string().optional(),
  });

  const randomID = nanoid();

  const normalizedChatSession =
    typeof chatSession === "string" &&
    chatSession.trim() &&
    chatSession !== "undefined" &&
    chatSession !== "null"
      ? chatSession.trim()
      : "";

  const defaultValues: z.infer<typeof FormSchema> = {
    chat_session: normalizedChatSession
      ? normalizedChatSession
      : checkSession === false
      ? randomID
      : "",
    phone_number: accounts?.phone ? String(accounts.phone) : "",
    email: accounts?.email ?? "",
    fullname: accounts?.fullname ?? "",
    complaint: "",
    date_of_birth: accounts?.birthdate
      ? new Date(accounts.birthdate)
      : new Date(),
    height: accounts?.height ? String(accounts.height) : "",
    weight: accounts?.weight ? String(accounts.weight) : "",
    gender: accounts?.gender ?? "",
    scheduled_datetime: new Date(),
    reference_image: [],
    domicile_city: domicile.city || "",
    domicile_district: domicile.district || "",
    domicile_address: domicile.address || "",
  };

  function parseDomicile(raw: unknown): {
    city?: string;
    district?: string;
    address?: string;
  } {
    if (!raw) return {};

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        return {};
      }
    }

    if (typeof raw === "object") {
      const obj = raw as any;
      return {
        city: typeof obj.city === "string" ? obj.city : undefined,
        district: typeof obj.district === "string" ? obj.district : undefined,
        address: typeof obj.address === "string" ? obj.address : undefined,
      };
    }

    return {};
  }

  function toUtcMidnightFromLocalDate(date: Date) {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  // const serializeDate = (d: Date) =>
  //   new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  //     .toISOString()
  //     .split("T")[0];

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    const pass = generatePassword(16);

    // console.log("Password Akun: ", pass);

    if (accounts?.id) {
      const res = await fetch(`${baseUrl}/api/schedule-consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_session: data.chat_session,
          phone_number: data.phone_number,
          email: data.email,
          fullname: data.fullname,
          complaint: data.complaint,
          date_of_birth: toUtcMidnightFromLocalDate(data.date_of_birth),
          height: data.height,
          weight: data.weight,
          gender: data.gender,
          scheduled_datetime: data.scheduled_datetime,
          reference_image: data.reference_image,
          location: {
            city: data.domicile_city?.trim() || "",
            district: data.domicile_district?.trim() || "",
            address: data.domicile_address?.trim() || "",
          },
          user_id: accounts?.id,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return toast.error("Submit failed", { description: json.error });
      }

      toast.success("Consult Scheduled!", {
        description: "Your request successfully saved.",
      });

      form.reset();
      setLoading(false);
      router.refresh();
    } else {
      const signUp = await signUpAction({
        email: data.email,
        password: pass,
        fullname: data.fullname,
      });

      if (signUp.error) {
        toast.error("Gagal Membuat Jadwal Konsultasi", {
          description: `${signUp.error}`,
          duration: 15000,
        });
      } else if (signUp.warning) {
        toast.warning("Gagal Membuat Jadwal Konsultasi", {
          description: `${signUp.warning}`,
          duration: 15000,
        });
      } else if (signUp.success) {
        const res = await fetch(`${baseUrl}/api/schedule-consult`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            user_id: signUp.user_id,
          }),
        });

        const json = await res.json();

        const supabase = await createClient();

        const { data: setToAccount, error: errorSetToAccount } = await supabase
          .from("accounts")
          .insert({
            phone: data.phone_number,
            gender: data.gender,
            birthdate: toUtcMidnightFromLocalDate(data.date_of_birth),
            height: Number(data.height),
            weight: Number(data.weight),
            domicile: {
              city: data.domicile_city?.trim() || "",
              district: data.domicile_district?.trim() || "",
              address: data.domicile_address?.trim() || "",
            },
          })
          .eq("id", signUp.user_id)
          .select("*")
          .single();

        if (errorSetToAccount) {
          setLoading(false);
          console.error("Error updating account details:", errorSetToAccount);
          toast.error("Gagal Membuat Jadwal Konsultasi", {
            description: errorSetToAccount.message,
            duration: 15000,
          });
        }

        if (!res.ok) {
          setLoading(false);
          return toast.error("Gagal Membuat Jadwal Konsultasi", {
            description: json.error,
            duration: 15000,
          });
        }

        const sendPassMail = await sendMail({
          email: `Password Akun M HEALTH <auth@m-health.id>`,
          sendTo: data.email, // ← Sebelumnya "logs@baikfilmfest.com", ubah ke email peserta
          subject: `Selamat Datang di M HEALTH!`,
          text: `Halo ${data.fullname}, 

Terima kasih telah bergabung bersama M HEALTH. Saat ini kami sedang melakukan verifikasi data yang anda kirimkan. Berikut adalah password yang diperlukan untuk masuk ke akun anda dan melihat link konsultasi online. Jangan khawatir kami juga mengirimkan link untuk konsultasi ke email dan nomor yang anda daftarkan. Setelah/ sebelum email ini anda terima kami telah mengirimkan link konfirmasi untuk masuk ke akun anda. 

Password Anda : ${pass}

Salam hangat kami, 
M HEALTH Development Team`,
        });

        if (sendPassMail?.success) {
          toast.success("Consult Scheduled!", {
            description:
              "Your request successfully saved. You're auto sign up. Check your email to sign in.",
            duration: 15000,
          });
        }
      }
      setLoading(false);
      form.reset();
      router.refresh();
    }
  }

  return (
    <div className="bg-white">
      <ContainerWrap
        size="md"
        className="flex justify-center items-center min-h-screen flex-col lg:min-w-2xl! lg:max-w-2xl!"
      >
        <Image
          src={
            "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
          }
          width={100}
          height={100}
          unoptimized
          alt="icon-m-health"
          className="object-contain w-full h-10 mb-10"
        />
        <div className="">
          <div className="mb-10">
            <h4 className="text-primary font-bold mb-2">{labels.title}</h4>
            <p className="text-muted-foreground">{labels.desc}</p>
          </div>
          <div className="question_to_answer mt-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="chat_session"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            {!checkSession
                              ? "ID Konsultasi"
                              : "ID Sesi Percakapan"}
                          </FormLabel>
                          <FormControl>
                            {!checkSession ? (
                              <span className="font-sans text-muted-foreground">
                                {field.value}
                              </span>
                            ) : (
                              <Link
                                href={`/${locale}/c/${chatSession}`}
                                target="_blank"
                              >
                                <Input
                                  {...field}
                                  type="text"
                                  readOnly
                                  className="h-12 cursor-pointer opacity-70"
                                />
                              </Link>
                            )}
                          </FormControl>
                          {checkSession && (
                            <FormDescription>
                              Sesi percakapan ini akan kami kirimkan kepada
                              dokter, sebagai salah satu rujukan.
                            </FormDescription>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* TextArea */}
                    <FormField
                      control={form.control}
                      name="complaint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            Ceritakan Keluhanmu
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Jika anda tidak direkomendasikan oleh AI saat mengakses halaman ini silahkan ceritakan secara detail keluhan yang anda rasakan. Jika anda direkomendasikan oleh AI, silahkan tambahkan informasi tambahan atau ketik "Sesuai Chat" yang mungkin dapat membantu dokter dalam memberikan penanganan.'
                              className="min-h-52"
                            />
                          </FormControl>
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
                            Gambar Pendukung{" "}
                          </FormLabel>
                          <FormDescription>
                            Opsional. Silahkan tambahkan gambar yang dapat
                            membantu dokter dalam memberikan penanganan jika
                            diperlukan.
                          </FormDescription>
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
                                className="hover:bg-muted bg-white rounded-2xl lg:min-w-md w-full h-full"
                              >
                                <DropzoneEmptyState />
                                <DropzoneContent />
                              </Dropzone>
                            </FormControl>
                          ) : uploadLoadingRFImage ? (
                            <div className="flex flex-col gap-5 mb-3">
                              <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
                            </div>
                          ) : (
                            referencePreview && (
                              <div className="flex flex-col gap-5 mb-3">
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

                                        const urls =
                                          await handleBatchImageUpload(
                                            acceptedFiles
                                          );

                                        if (urls) {
                                          const oldImages =
                                            form.getValues("reference_image") ||
                                            [];
                                          const merged = [
                                            ...oldImages,
                                            ...urls,
                                          ];
                                          form.setValue(
                                            "reference_image",
                                            merged
                                          );
                                          setReferencePreview(merged);
                                          setUploadLoadingRFImage(false);
                                        }
                                      }}
                                      onError={console.error}
                                      className="hover:bg-muted bg-white rounded-2xl lg:min-w-sm w-full"
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
                )}

                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="lg:grid grid-cols-2 flex flex-col gap-5">
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
                    </div>

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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="lg:grid grid-cols-2 flex flex-col gap-5">
                      {/* Height */}
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold!">
                              Height
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="number"
                                  className="h-12"
                                />
                                <div className="bg-accent absolute right-0 top-0 h-12 w-12 border rounded-2xl flex items-center justify-center">
                                  <p>CM</p>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Weight */}
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold!">
                              Weight
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="number"
                                  className="h-12"
                                />
                                <div className="bg-accent absolute right-0 top-0 h-12 w-12 border rounded-2xl flex items-center justify-center">
                                  <p>KG</p>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="lg:grid grid-cols-2 flex flex-col gap-5">
                      {/* Date of Birth */}
                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold!">
                              Date of Birth{" "}
                              {field.value && (
                                <span className="bg-accent px-2 py-1 rounded-lg inline-flex! w-fit text-muted-foreground">
                                  {getAgeDetail(field.value).years} Tahun{" "}
                                  {getAgeDetail(field.value).months} Bulan
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <CalendarDatePicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold!">
                              Gender
                            </FormLabel>

                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-0"
                            >
                              {[
                                { id: "male", label: "Male" },
                                { id: "female", label: "Female" },
                              ].map((item) => (
                                <FormItem
                                  key={item.id}
                                  className="flex items-center space-x-2"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={item.id}
                                      id={item.id}
                                    />
                                  </FormControl>
                                  <FormLabel
                                    htmlFor={item.id}
                                    className="font-normal cursor-pointer"
                                  >
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Normal String */}
                    {/* Normal String */}
                    <FormField
                      control={form.control}
                      name="domicile_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            {locale === "id" ? "Kota" : "City"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="domicile_district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            {locale === "id" ? "Kecamatan" : "District"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="domicile_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            {locale === "id"
                              ? "Alamat Lengkap"
                              : "Full Address"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="">
                      {/* Schedule */}
                      <FormField
                        control={form.control}
                        name="scheduled_datetime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold!">
                              Meeting Schedule
                            </FormLabel>
                            <FormControl>
                              <CalendarScheduleFull
                                selected={field.value}
                                onChange={field.onChange}
                                dateBooked={dateBooked}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs!">
                        Dengan mengirim form ini anda telah menyetujui{" "}
                        <span
                          className="text-health underline cursor-pointer"
                          onClick={() => router.push("/terms-of-service")}
                        >
                          Ketentuan Penggunaan
                        </span>{" "}
                        dan{" "}
                        <span
                          className="text-health underline cursor-pointer"
                          onClick={() => router.push("/privacy")}
                        >
                          Kebijakan Privasi
                        </span>{" "}
                        kami. Melalui pendaftaran konsultasi ini anda akan
                        secara otomatis terdaftar di M HEALTH. Untuk masuk ke
                        akun anda silahkan klik tautan pada email yang telah
                        kami kirimkan kepada anda. Password untuk masuk juga
                        telah terkirim ke email anda.
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-wrap mt-5 gap-5",
                    currentStep === 1 ? "justify-end" : "justify-between"
                  )}
                >
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      className="rounded-2xl w-full"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}

                  {currentStep < 3 && (
                    <Button
                      type="button"
                      className="rounded-2xl w-full"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}

                  {currentStep === 3 && (
                    <div className="lg:col-span-2 col-span-1 w-full">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl flex w-full"
                      >
                        {loading ? <Spinner /> : "Submit"}
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </ContainerWrap>
    </div>
  );
};

export default CWDComponent;
