"use client";

import CalendarDatePicker from "@/components/Form/CalendarDatePicker";
import { PhoneInput } from "@/components/Form/phone-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { getAgeDetail } from "@/helper/getAge";
import {
  patchAccount,
  patchAccountByAdmin,
} from "@/lib/users/post-patch-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Image from "next/image";
import { routing } from "@/i18n/routing";

const accountFormSchema = z.object({
  email: z.email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  height: z.number().min(30, "Height must be at least 30 cm"),
  weight: z.number().min(3, "Weight must be at least 3 kg"),
  birthdate: z.date(),
  avatar_url: z.union([z.url("Invalid URL"), z.literal("")]).optional(),
  gender: z.enum(["male", "female"]),
  domicile_city: z.string().optional(),
  domicile_district: z.string().optional(),
  domicile_address: z.string().optional(),
});

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

const AccountClientForm = ({
  locale,
  account,
  admin,
}: {
  locale: string;
  account: any;
  admin?: boolean;
}) => {
  const [loading, setLoading] = React.useState(false);
  const domicile = parseDomicile(account?.domicile);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    account.avatar_url || null
  );
  const [uploadLoadingAvatar, setUploadLoadingAvatar] = useState(false);

  async function handleImageUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]); // upload 1 dulu, nanti jika mau multiple bisa looping
    formData.append("model", "avatar");
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
    field: "default" | "avatar",

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
      if (field === "avatar") {
        setAvatarPreview(null);
        form.setValue("avatar_url", "");
        toast.success("Image Avatar Deleted!");
      }
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to delete");
    }
  }

  const router = useRouter();
  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: account.email || "",
      phone_number: account.phone ? String(account.phone) : "",
      fullname: account.fullname || "",
      height:
        typeof account.height === "number"
          ? account.height
          : Number(account.height) || 0,
      weight:
        typeof account.weight === "number"
          ? account.weight
          : Number(account.weight) || 0,
      birthdate: new Date(account.birthdate) || new Date(),
      avatar_url: account.avatar_url || "",
      gender: account.gender || "male",
      domicile_city: domicile.city || "",
      domicile_district: domicile.district || "",
      domicile_address: domicile.address || "",
    },
  });

  async function onSubmit(data: z.infer<typeof accountFormSchema>) {
    setLoading(true);

    let res;

    if (!admin) {
      res = await patchAccount({
        email: data.email,
        fullname: data.fullname,
        phone: data.phone_number,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        birthdate: toUtcMidnightFromLocalDate(data.birthdate),
        avatar_url: data.avatar_url || undefined,
        domicile: {
          city: data.domicile_city?.trim() || "",
          district: data.domicile_district?.trim() || "",
          address: data.domicile_address?.trim() || "",
        },
      });
    } else {
      res = await patchAccountByAdmin(
        {
          email: data.email,
          fullname: data.fullname,
          phone: data.phone_number,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          birthdate: toUtcMidnightFromLocalDate(data.birthdate),
          avatar_url: data.avatar_url || undefined,
          domicile: {
            city: data.domicile_city?.trim() || "",
            district: data.domicile_district?.trim() || "",
            address: data.domicile_address?.trim() || "",
          },
        },
        { id: account.id }
      );
    }

    if (res.success) {
      setLoading(false);
      toast.success(locale === "id" ? res.message?.id : res.message?.en);
      if (!admin) {
        router.refresh();
      } else {
        router.push(`/${locale}/studio/users`);
      }
    } else if (res.error) {
      setLoading(false);
      toast.error(locale === "id" ? res.error.id : res.error.en);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-5">
            <div className="lg:grid grid-cols-2 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:max-w-sm">
                    <FormLabel className="text-primary font-semibold!">
                      Avatar
                    </FormLabel>

                    {uploadLoadingAvatar ? (
                      <Skeleton className="aspect-square w-2/6 rounded-full mt-3 object-cover border" />
                    ) : !avatarPreview ? (
                      <FormControl>
                        <Dropzone
                          accept={{ "image/*": [] }}
                          maxSize={1024 * 1024 * 5}
                          onDrop={async (acceptedFiles) => {
                            setUploadLoadingAvatar(true);
                            try {
                              const url = await handleImageUpload(
                                acceptedFiles
                              );

                              if (url) {
                                form.setValue("avatar_url", url, {
                                  shouldValidate: true,
                                });
                                setAvatarPreview(url);
                              }
                            } finally {
                              setUploadLoadingAvatar(false);
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
                      avatarPreview && (
                        <div className="relative mb-5 w-42 h-42">
                          <Image
                            src={avatarPreview || "/placeholder.svg"}
                            width={320}
                            height={320}
                            alt={avatarPreview}
                            className="aspect-square w-42 h-42 rounded-full mt-3 object-cover border"
                          />
                          <Button
                            size="sm"
                            type="button"
                            variant={"destructive"}
                            onClick={() =>
                              handleDelete(
                                avatarPreview.replace(
                                  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
                                  ""
                                ),
                                "avatar"
                              )
                            }
                            className="absolute w-10 h-10 top-5 right-0 rounded-full shadow-2xl"
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
                      <Input
                        readOnly
                        {...field}
                        type="email"
                        className="h-12"
                      />
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
                      {locale === routing.defaultLocale
                        ? "Nomor Telepon"
                        : "Phone Number"}
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
                    {locale === "id" ? "Nama Lengkap" : "Full Name"}
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
                      {locale === "id" ? "Tinggi Badan" : "Height"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          className="h-12"
                          onChange={(e) =>
                            field.onChange(e.currentTarget.valueAsNumber)
                          }
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
                      {locale === "id" ? "Berat Badan" : "Weight"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          className="h-12"
                          onChange={(e) =>
                            field.onChange(e.currentTarget.valueAsNumber)
                          }
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
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      {locale === "id" ? "Tanggal Lahir" : "Date of Birth"}{" "}
                      {/* {field.value && (
                        <span className="bg-accent px-2 py-1 rounded-lg inline-flex! w-fit text-muted-foreground">
                          {getAgeDetail(field.value).years} Tahun{" "}
                          {getAgeDetail(field.value).months} Bulan
                        </span>
                      )} */}
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
                      {locale === "id" ? "Jenis Kelamin" : "Gender"}
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
                            <RadioGroupItem value={item.id} id={item.id} />
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

            <div className="lg:grid grid-cols-2 flex flex-col gap-5">
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
                      {locale === "id" ? "Alamat Lengkap" : "Full Address"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              className="h-12 lg:w-fit w-full rounded-full"
              disabled={loading}
            >
              {loading
                ? locale === "id"
                  ? "Memperbarui..."
                  : "Updating..."
                : locale === "id"
                ? "Perbarui Akun"
                : "Update Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountClientForm;
