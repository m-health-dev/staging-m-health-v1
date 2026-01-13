"use client";

import CalendarDatePicker from "@/components/Form/CalendarDatePicker";
import { PhoneInput } from "@/components/Form/phone-input";
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
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Image from "next/image";
import { routing } from "@/i18n/routing";
import { usePaymentFlow } from "@/components/pay/PaymentFlowProvider";
import { Textarea } from "@/components/ui/textarea";

const accountFormSchema = z.object({
  email: z.email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  domicile_city: z
    .string()
    .min(3, "Province/ City must be at least 3 characters"),
  domicile_district: z
    .string()
    .min(3, "District must be at least 3 characters"),
  domicile_address: z.string().min(3, "Address must be at least 3 characters"),
  domicile_postal_code: z
    .string()
    .min(3, "Postal code must be at least 3 characters"),
});

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
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export type BookingFormHandle = {
  submit: () => Promise<boolean>;
};

type BookingClientFormProps = {
  locale: string;
  account: any;
  admin?: boolean;
};

const BookingClientForm = forwardRef<BookingFormHandle, BookingClientFormProps>(
  ({ locale, account, admin }, ref) => {
    const [loading, setLoading] = React.useState(false);
    const { setBookingSubmit, setBookingLoading } = usePaymentFlow();
    const domicile = parseDomicile(account?.domicile);

    const router = useRouter();
    const form = useForm<z.infer<typeof accountFormSchema>>({
      resolver: zodResolver(accountFormSchema),
      defaultValues: {
        email: account.email || "",
        phone_number: account.phone ? String(account.phone) : "",
        fullname: account.fullname || "",
        domicile_city: domicile.city || "",
        domicile_district: domicile.district || "",
        domicile_address: domicile.address || "",
        domicile_postal_code: domicile.postal_code || "",
      },
    });

    async function onSubmit(data: z.infer<typeof accountFormSchema>) {
      if (loading) return false;
      setLoading(true);
      setBookingLoading(true);

      let res;

      if (!admin) {
        res = await patchAccount({
          email: data.email,
          fullname: data.fullname,
          phone: data.phone_number,
          domicile: {
            city: data.domicile_city?.trim() || "",
            district: data.domicile_district?.trim() || "",
            address: data.domicile_address?.trim() || "",
            postal_code: data.domicile_postal_code?.trim() || "",
          },
        });
      } else {
        res = await patchAccountByAdmin(
          {
            email: data.email,
            fullname: data.fullname,
            phone: data.phone_number,
            domicile: {
              city: data.domicile_city?.trim() || "",
              district: data.domicile_district?.trim() || "",
              address: data.domicile_address?.trim() || "",
              postal_code: data.domicile_postal_code?.trim() || "",
            },
          },
          { id: account.id }
        );
      }

      if (res.success) {
        setLoading(false);
        setBookingLoading(false);
        toast.success(
          locale === "id"
            ? "Data pemesanan berhasil disimpan!"
            : "Booking data saved successfully!"
        );

        router.refresh();

        return true;
      }

      if (res.error) {
        setLoading(false);
        setBookingLoading(false);
        toast.error(
          locale === "id"
            ? "Data pemesanan gagal disimpan!"
            : "Failed to save booking data!"
        );
      }

      return false;
    }

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let success = false;
        await form.handleSubmit(async (data) => {
          success = await onSubmit(data);
        })();
        return success;
      },
    }));

    useEffect(() => {
      setBookingSubmit(async () => {
        let success = false;
        await form.handleSubmit(async (data) => {
          success = await onSubmit(data);
        })();
        return success;
      });

      return () => setBookingSubmit(null);
    }, [form, setBookingSubmit]);

    return (
      <div className="bg-white p-5 border rounded-2xl">
        <h3 className="text-primary font-bold mb-4">
          {locale === "id" ? "Formulir Pemesanan" : "Booking Form"}
        </h3>
        <p className="mb-5 text-primary text-xs! bg-blue-50 border-l-4 border-blue-500 px-4 py-2">
          {locale === "id"
            ? "Pastikan data berikut sudah benar. Silahkan isi/ perbaiki data berikut untuk mempermudah proses pemesanan, data akan secara otomatis disimpan sebagai data akun anda."
            : "Please make sure the following data is correct. Please fill in/ correct the following data to facilitate the ordering process, the data will be automatically saved to your account."}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                <FormField
                  control={form.control}
                  name="domicile_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        {locale === "id" ? "Kota/ Provinsi" : "Province/ City"}
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
                  name="domicile_postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        {locale === "id" ? "Kode Pos" : "Postal Code"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="domicile_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      {locale === "id" ? "Alamat Lengkap" : "Full Address"}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-32" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    );
  }
);

BookingClientForm.displayName = "BookingClientForm";

export default BookingClientForm;
