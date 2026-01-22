"use client";

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
import ContainerWrap from "@/components/utility/ContainerWrap";
import { AuthSignInSchema, ForgotPassSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";

import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordAction } from "../actions/auth.actions";
import Link from "next/link";
import { routing } from "@/i18n/routing";

const ForgotPassClient = ({ locale }: { locale: string }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();
  const params = useSearchParams();
  const emailParams = params.get("email");

  const form = useForm<z.infer<typeof ForgotPassSchema>>({
    resolver: zodResolver(ForgotPassSchema),
    defaultValues: {
      email: emailParams?.toString() || "",
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPassSchema>) {
    setLoading(true);

    const response = await forgotPasswordAction(data);

    if (response?.warning) {
      setLoading(false);
      setWarning(locale === routing.defaultLocale ? response.warning.id : response.warning.en);
    } else if (response?.error) {
      setLoading(false);
      setError(locale === routing.defaultLocale ? response.error.id : response.error.en);
    } else if (response?.success && response?.message) {
      setLoading(false);
      setSuccess(
        `${locale === routing.defaultLocale ? response.message.id : response.message.en}`,
      );
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <ContainerWrap size="xl">
        <div className="flex items-center justify-center">
          <div className="md:max-w-sm w-full col-span-1">
            <Link href={`/${locale}`}>
              <Image
                src={
                  "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
                }
                width={180}
                height={60}
                className="object-contain mb-8 flex justify-center items-center"
                alt="M-HEALTH Logo"
              />
            </Link>
            <h3 className="font-bold text-primary mb-10">
              {locale === routing.defaultLocale ? "Lupa Kata Sandi" : "Forgot Your Password?"}
            </h3>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === routing.defaultLocale ? "Permintaan Gagal" : "Request Failed"}
                </p>
                <p className="text-sm!">{error}</p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === routing.defaultLocale ? "Permintaan Gagal" : "Request Failed"}
                </p>
                <p className="text-sm!">{warning}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-500 p-4 border border-green-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === routing.defaultLocale
                    ? "Permintaan Berhasil"
                    : "Request Successful"}
                </p>
                <p className="text-sm!">{success}</p>
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="*:mb-5 mt-5"
              >
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
                <div>
                  <p className="text-muted-foreground text-sm!">
                    {locale === routing.defaultLocale
                      ? "Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda."
                      : "We will send a link to reset your password."}
                  </p>
                </div>
                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <p>
                      {locale === routing.defaultLocale
                        ? "Atur Ulang Kata Sandi"
                        : "Reset Password"}
                    </p>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </ContainerWrap>
    </div>
  );
};

export default ForgotPassClient;
