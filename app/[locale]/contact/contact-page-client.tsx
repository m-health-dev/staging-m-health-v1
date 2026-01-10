"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z, { set } from "zod";
import { sendContactMessage } from "./contact-action";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/Form/phone-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";
import { contactSchema } from "@/lib/zodSchema";

const ContactPageClient = () => {
  const [loading, setLoading] = React.useState(false);
  const [messageId, setMessageId] = React.useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      message: "",
      subject: "",
    },
  });

  async function onSubmit(data: z.infer<typeof contactSchema>) {
    setLoading(true);
    const res = await sendContactMessage(data);

    if (res.success) {
      setLoading(false);
      setMessageId(res.message_id!);
      toast.success(locale === "id" ? res.message?.id : res.message?.en);
      form.reset();
    } else if (res.error) {
      setLoading(false);
      toast.error(locale === "id" ? res.error.id : res.error.en);
    }
  }

  return (
    <div>
      {messageId && (
        <div className="bg-white p-4 mb-5 rounded-2xl border">
          <p className="text-xs! text-muted-foreground">
            {locale === routing.defaultLocale
              ? "Nomor ID Pesan Anda"
              : "Your Message ID"}
          </p>
          <p className="uppercase bg-primary text-white px-3 py-1 rounded-full inline-flex mt-1">
            {messageId}
          </p>
          <p className="mt-2 text-xs! text-muted-foreground">
            {locale === routing.defaultLocale
              ? "Mohon simpan ID pesan ini untuk referensi di masa mendatang, jika pesan anda belum kami balas dalam 3x24 jam. Silahkan hubungi kami kembali dengan menyertakan ID pesan ini di awal subjek."
              : "Please save this message ID for future reference. If we have not responded to your message within 3x24 hours, please contact us again with this message ID in the subject line."}
          </p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-primary font-semibold!">
                    {locale === routing.defaultLocale ? "Nama" : "Name"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-5">
            {/* Normal String */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-primary font-semibold!">
                    {locale === routing.defaultLocale ? "Subjek" : "Subject"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TextArea */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-semibold!">
                    {locale === routing.defaultLocale ? "Pesan" : "Message"}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-32" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end w-full mt-5">
            <Button
              type="submit"
              disabled={loading}
              className=" h-12 rounded-full"
            >
              {loading && <Spinner />}
              {loading
                ? locale === "id"
                  ? "Mengirim..."
                  : "Sending..."
                : locale === "id"
                ? "Kirim Pesan"
                : "Send Message"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactPageClient;
