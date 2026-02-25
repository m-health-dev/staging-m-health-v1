"use client";

import React, { useState } from "react";

import { PhoneInput } from "@/components/Form/phone-input";

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

import { Textarea } from "@/components/ui/textarea";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { cn } from "@/lib/utils";
import { emailSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { EyeClosed, Eye, Trash } from "lucide-react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z, { check } from "zod";
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
import ConsultationSchedulePicker from "@/components/Form/ConsultationSchedulePicker";

import { nanoid } from "nanoid";

import { Account } from "@/types/account.types";
import { getAgeDetail } from "@/helper/getAge";
import { generatePassword } from "@/helper/getPassword";
import Link from "next/link";

import {
  createConsultation,
  updateConsultation,
} from "@/lib/consult/post-patch-consultation";
import { routing } from "@/i18n/routing";

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

const UpdateConsultationData = ({
  accounts,
  locale,
  labels,
  data,
  id,
}: {
  accounts?: Account;
  locale: string;
  labels?: any;
  data: any;
  id: string;
}) => {
  // console.log(dateBooked);

  const [loading, setLoading] = useState(false);
  const [uploadLoadingRFImage, setUploadLoadingRFImage] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [referencePreview, setReferencePreview] = useState<string[]>(
    data.reference_image || [],
  );
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
    field: "logo" | "highlight" | "reference",
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
    complaint: z.string().optional(),
    date_of_birth: z.date(),
    height: z.string().min(1).max(3),
    weight: z.string().min(1).max(3),
    gender: z.string().min(1),
    scheduled_datetime: z.date(),
    reference_image: z.array(z.string()).optional(),
    domicile_city: z.string().optional(),
    domicile_district: z.string().optional(),
    domicile_address: z.string().optional(),
    domicile_postal_code: z.string().optional(),
  });

  const randomID = nanoid();

  const defaultValues: z.infer<typeof FormSchema> = {
    chat_session: data.chat_session,
    phone_number: accounts?.phone ? String(accounts.phone) : "",
    email: accounts?.email ?? "",
    fullname: accounts?.fullname ?? "",
    complaint: data.complaint ?? "",
    date_of_birth: accounts?.birthdate
      ? new Date(accounts.birthdate)
      : new Date(),
    height: accounts?.height ? String(accounts.height) : "",
    weight: accounts?.weight ? String(accounts.weight) : "",
    gender: accounts?.gender ?? "",
    scheduled_datetime: data.scheduled_datetime
      ? new Date(data.scheduled_datetime)
      : new Date(),
    reference_image: data.reference_image || [],
    domicile_city: domicile.city || "",
    domicile_district: domicile.district || "",
    domicile_address: domicile.address || "",
    domicile_postal_code: domicile.postal_code || "",
  };

  function parseDomicile(raw: unknown): {
    city?: string;
    district?: string;
    address?: string;
    postal_code?: string;
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
        postal_code:
          typeof obj.postal_code === "string" ? obj.postal_code : undefined,
      };
    }

    return {};
  }

  function toUtcMidnightFromLocalDate(date: Date) {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
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

    const res = await updateConsultation(
      {
        chat_session: data.chat_session,
        phone_number: data.phone_number,
        email: data.email,
        fullname: data.fullname,
        complaint: data.complaint,
        date_of_birth: toUtcMidnightFromLocalDate(data.date_of_birth),
        height: Number(data.height),
        weight: Number(data.weight),
        gender: data.gender,
        scheduled_datetime: data.scheduled_datetime,
        reference_image: data.reference_image || [],
        location: {
          city: data.domicile_city?.trim() || "",
          district: data.domicile_district?.trim() || "",
          address: data.domicile_address?.trim() || "",
          postal_code: data.domicile_postal_code?.trim() || "",
        },
      },
      id,
    );

    if (res.error) {
      setLoading(false);
      return toast.error(
        locale === routing.defaultLocale
          ? "Gagal Memperbarui Jadwal Konsultasi"
          : "Failed to Update Consult Schedule",
        {
          description: `${res.error}`,
          duration: 15000,
        },
      );
    }

    toast.success(
      locale === routing.defaultLocale
        ? "Jadwal Konsultasi Berhasil Diperbarui"
        : "Consult Schedule Updated!",
      {
        description:
          locale === routing.defaultLocale
            ? "Permintaan Anda berhasil disimpan."
            : "Your request successfully saved.",
        duration: 15000,
      },
    );

    form.reset();
    setLoading(false);
    router.push(`/${locale}/studio/consult/schedule`);
  }

  // Helper function to parse scheduled_datetime ISO string
  const parseScheduledDateTime = (isoString: string | Date | undefined) => {
    if (!isoString) return { date: "", time: "" };

    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return { date: "", time: "" };

    // Format date as YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    // Format time as HH:mm
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return { date, time };
  };

  // Parse the current schedule from data
  const currentScheduleParsed = parseScheduledDateTime(data.scheduled_datetime);

  return (
    <div className="bg-white">
      <ContainerWrap
        size="md"
        className="flex justify-center items-center min-h-screen flex-col lg:min-w-2xl! lg:max-w-2xl! py-20"
      >
        <div className="">
          <div className="mb-10">
            <h4 className="text-primary font-bold mb-2">
              Update Consultation Schedule Data
            </h4>
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
                            {locale === routing.defaultLocale
                              ? "ID Percakapan/ Konsultasi"
                              : "Conversation/ Consultation ID"}
                          </FormLabel>
                          <FormControl>
                            {data.chat_session.trim().length > 21 ? (
                              <span className="font-sans text-muted-foreground uppercase">
                                {field.value}
                              </span>
                            ) : (
                              <Link
                                href={`/${locale}/studio/chat-activity/preview/${data.chat_session}`}
                                target="_blank"
                              >
                                <Input
                                  {...field}
                                  type="text"
                                  readOnly
                                  className="h-12 cursor-pointer opacity-70 uppercase"
                                />
                              </Link>
                            )}
                          </FormControl>
                          {data.chat_session.length > 21 && (
                            <FormDescription>
                              {locale === routing.defaultLocale
                                ? "Sesi percakapan ini adalah referensi yang akan dikirimkan kepada dokter, sebagai salah satu rujukan. Klik pada kolom untuk membuka sesi percakapan anda kembali."
                                : "This chat session will be sent to the doctor as a reference. Click on the field to open your chat session again."}
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
                            {locale === routing.defaultLocale
                              ? "Ceritakan Kondisi Kesehatan Anda"
                              : "Describe Your Health Condition"}
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
                            {locale === routing.defaultLocale
                              ? "Unggah Gambar Referensi (Opsional)"
                              : "Upload Reference Images (Optional)"}
                          </FormLabel>
                          <FormDescription>
                            {locale === routing.defaultLocale
                              ? "Silahkan tambahkan gambar yang dapat membantu dokter dalam memberikan penanganan jika diperlukan."
                              : "Please add images that may help the doctor in providing treatment if necessary."}
                          </FormDescription>
                          {uploadLoadingRFImage ? (
                            <div className="flex flex-col gap-5 mb-3">
                              <Skeleton className="aspect-video w-full rounded-2xl object-cover border" />
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
                                className="hover:bg-muted bg-white rounded-2xl lg:min-w-md w-full h-full"
                              >
                                <DropzoneEmptyState />
                                <DropzoneContent />
                              </Dropzone>
                            </FormControl>
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
                                            acceptedFiles,
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
                                            merged,
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
                    <FormField
                      control={form.control}
                      name="domicile_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            {locale === routing.defaultLocale
                              ? "Kota/ Provinsi"
                              : "City/ Province/ State"}
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
                            {locale === routing.defaultLocale
                              ? "Kecamatan"
                              : "District"}
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
                      name="domicile_postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            {locale === routing.defaultLocale
                              ? "Kode Pos"
                              : "Postal Code"}
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
                            {locale === routing.defaultLocale
                              ? "Alamat Lengkap"
                              : "Full Address"}
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-32" />
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
                              {locale === routing.defaultLocale
                                ? "Jadwal Konsultasi"
                                : "Consultation Schedule"}
                            </FormLabel>
                            <FormControl>
                              <ConsultationSchedulePicker
                                selected={field.value}
                                onChange={field.onChange}
                                locale={locale}
                                mode="update"
                                currentSchedule={{
                                  date: currentScheduleParsed.date,
                                  time: currentScheduleParsed.time,
                                }}
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
                          onClick={() => router.push("/terms")}
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
                    currentStep === 1 ? "justify-end" : "justify-between",
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

export default UpdateConsultationData;
