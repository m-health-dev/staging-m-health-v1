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
import {
  AuthSignInSchema,
  ForgotPassSchema,
  resetPasswordSchema,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye, EyeOff, Undo2 } from "lucide-react";
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
import { resetPasswordAction } from "../actions/auth.actions";
import { locale } from "dayjs";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Turnstile } from "@marsidev/react-turnstile";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const ResetPassClient = ({ locale }: { locale: string }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();
  const params = useSearchParams();
  const emailParams = params.get("email");

  const [captchaResetToken, setCaptchaResetToken] = React.useState<string>("");
  const [captchaReady, setCaptchaReady] = React.useState(false);

  const captcha = React.useRef<any>(null);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setLoading(true);

    const response = await resetPasswordAction(data, captchaResetToken);

    if (response?.warning) {
      setLoading(false);
      setWarning(
        locale === routing.defaultLocale
          ? response.warning.id
          : response.warning.en,
      );
      // if (captcha.current) {
      //   captcha.current.resetCaptcha();
      // }
    } else if (response?.error) {
      setLoading(false);
      setError(
        locale === routing.defaultLocale
          ? response.error.id
          : response.error.en,
      );
      // if (captcha.current) {
      //   captcha.current.resetCaptcha();
      // }
    } else if (response?.success) {
      setLoading(false);

      setSuccess(`${response.success}`);
      toast.success(`${response.success}`);
      // if (captcha.current) {
      //   captcha.current.resetCaptcha();
      // }
      form.reset();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <ContainerWrap size="xl">
        <div className="lg:top-5 lg:left-5 lg:mb-0 mb-5 lg:fixed w-fit">
          <Button
            className="w-full rounded-full flex items-center gap-2 mb-3 bg-white text-gray-500 border hover:bg-gray-50"
            onClick={() => router.back()}
          >
            <Undo2 /> {locale === routing.defaultLocale ? "Kembali" : "Back"}
          </Button>
        </div>
        <div className="flex min-h-screen items-center justify-center">
          <div className="md:max-w-sm w-full col-span-1">
            <Link href={`/${locale}`}>
              <Image
                src={
                  "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo.PNG"
                }
                width={180}
                height={60}
                className="object-contain mb-8 flex justify-center items-center"
                alt="M-HEALTH Logo"
              />
            </Link>
            <h3 className="font-bold text-primary mb-2">
              {locale === routing.defaultLocale
                ? "Atur Ulang Kata Sandi Anda"
                : "Reset Your Password"}
            </h3>
            <p className="mb-8 text-sm! text-muted-foreground">
              {locale === routing.defaultLocale
                ? "Anda hanya memiliki 3 kali percobaan untuk memulihkan akun Anda. Setelah itu, Anda perlu menghubungi dukungan."
                : "You only have 3 attempts to recover your account. After that, you will need to contact support."}
            </p>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === routing.defaultLocale
                    ? "Permintaan Gagal"
                    : "Request Failed"}
                </p>
                <p className="text-sm!">{error}</p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === routing.defaultLocale
                    ? "Permintaan Gagal"
                    : "Request Failed"}
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
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        {locale === routing.defaultLocale
                          ? "Kata Sandi Baru"
                          : "New Password"}
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        {locale === routing.defaultLocale
                          ? "Konfirmasi Kata Sandi"
                          : "Confirm Password"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative w-full h-12">
                          <Input
                            {...field}
                            type={`${
                              showConfirmPassword ? "text" : "password"
                            }`}
                            className="h-12"
                          />
                          <div className="absolute right-4 top-0 flex min-h-full items-center">
                            {showConfirmPassword ? (
                              <EyeClosed
                                className="size-5 text-primary"
                                onClick={() => setShowConfirmPassword(false)}
                              />
                            ) : (
                              <Eye
                                className="size-5 text-primary"
                                onClick={() => setShowConfirmPassword(true)}
                              />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="h-16 mt-5">
                  <Skeleton
                    className={cn(
                      "w-full h-16 rounded-md",
                      !captchaReady ? "block opacity-100" : "hidden opacity-0",
                    )}
                  />

                  {/* <HCaptcha
                    ref={captcha}
                    sitekey="d3e80ba8-85b0-46e2-8960-eb4a2afcbb64"
                    onVerify={(token) => {
                      setCaptchaResetToken(token);
                    }}
                    theme="light"
                    size="normal"
                    languageOverride={
                      locale === routing.defaultLocale ? "id" : "en"
                    }
                    onLoad={() => {
                      setCaptchaReady(true);
                    }}
                    onExpire={() => setCaptchaResetToken("")}
                    onError={() => setCaptchaResetToken("")}
                  /> */}

                  <Turnstile
                    ref={captcha}
                    siteKey="0x4AAAAAACOWvPh9bptcSxI4"
                    onSuccess={(token: any) => {
                      setCaptchaResetToken(token);
                    }}
                    options={{
                      theme: "light",
                      size: "flexible",
                      language: locale === routing.defaultLocale ? "id" : "en",
                    }}
                    onWidgetLoad={() => {
                      setCaptchaReady(true);
                    }}
                    onExpire={() => setCaptchaResetToken("")}
                    onError={() => setCaptchaResetToken("")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!captchaResetToken || loading}
                  className="w-full h-12 rounded-full"
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <p>
                      {locale === routing.defaultLocale
                        ? "Atur Ulang Kata Sandi"
                        : "Change Password"}
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

export default ResetPassClient;
