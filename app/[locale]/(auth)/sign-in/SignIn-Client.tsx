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
import { EyeClosed, Eye, ChevronsRight, Undo2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";

import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Sign, sign } from "crypto";
import { useLocale } from "next-intl";
import {
  forgotPasswordAction,
  signInAction,
  signWithGoogle,
} from "../actions/auth.actions";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { Skeleton } from "@/components/ui/skeleton";

const SignInClient = ({
  component = false,
  SignInToChat,
  onSignInSuccess,
}: {
  component?: boolean;
  SignInToChat?: boolean;
  onSignInSuccess?: () => void;
}) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();
  const path = usePathname();
  const redirectData = params.get("redirect") || `/${locale}/dashboard`;
  const continueData = params.get("continue");
  const emailData = params.get("email");
  const resetData = params.get("reset");
  const recordResetData = params.get("record");

  const [captchaInToken, setCaptchaInToken] = React.useState<string>("");
  const [captchaReady, setCaptchaReady] = React.useState(false);

  const redirectRecord = path.startsWith(`/${locale}/c`)
    ? path
    : redirectData?.toString();

  useEffect(() => {
    const newRequestCount = 3 - Number(recordResetData);
    if (resetData === "success") {
      toast.success(
        locale === routing.defaultLocale
          ? "Berhasil Memulihkan Akun"
          : "Account Recovery Successful",
        {
          description: `${locale === routing.defaultLocale ? "Kata sandi telah diperbarui, selalu ingat kata sandi yang baru ya!" : "Your password has been updated, always remember your new password!"} ${
            newRequestCount === 0
              ? locale === routing.defaultLocale
                ? "Ini adalah kesempatan terakhir untuk memulihkan akunmu. Jika kamu lupa kata sandi lagi, kamu harus menghubungi dukungan pelanggan kami."
                : "This is your last chance to recover your account. If you forget your password again, you will need to contact our customer support."
              : locale === routing.defaultLocale
                ? `Kamu memiliki ${newRequestCount} kesempatan lagi untuk memulihkan akunmu.`
                : `You have ${newRequestCount} more attempts to recover your account.`
          } `,
          duration: 30000,
        },
      );
    }
  }, [recordResetData]);

  console.log("path:", path);

  const form = useForm<z.infer<typeof AuthSignInSchema>>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: emailData || "",
      password: "",
      redirect: path.startsWith(`/${locale}/c`)
        ? path
        : redirectData?.toString(),
    },
  });

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await signWithGoogle(redirectRecord);

    if (response?.error) {
      toast.error(`Autentifikasi Google Gagal`, {
        description: `${response.error}`,
      });
    } else if (response?.warning) {
      toast.warning(`Autentifikasi Google Gagal`, {
        description: `${response.warning}`,
      });
    } else {
      return;
    }
  };

  async function onSubmit(data: z.infer<typeof AuthSignInSchema>) {
    setLoading(true);
    const res = await signInAction(data, captchaInToken as string);

    if (res?.error) {
      setLoading(false);
      setError(
        locale === routing.defaultLocale ? res?.error.id : res?.error.en,
      );
    } else if (res?.warning) {
      setLoading(false);
      setWarning(
        locale === routing.defaultLocale ? res?.warning.id : res?.warning.en,
      );
    } else {
      setLoading(false);
      onSignInSuccess?.();
      return;
    }
    // } else {
    //   toast.error("Sign In Failed. Please check your credentials.", {
    //     description: "If you encounter issues, please contact support.",
    //   });
    // }
    setLoading(false);
  }

  return component ? (
    <div className={cn("flex flex-col justify-center bg-white")}>
      <div
        className={cn(
          "lg:grid lg:grid-cols-2 flex flex-col gap-8 items-start justify-center lg:p-3 p-0",
        )}
      >
        <div>
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

          <h3
            className={cn(
              "font-bold text-primary",
              SignInToChat ? "mb-4" : "mb-10",
            )}
          >
            {locale === routing.defaultLocale
              ? "Masuk"
              : "Log In to Your Account"}
          </h3>
          {SignInToChat && (
            <p className="text-sm! text-muted-foreground">
              {locale === routing.defaultLocale
                ? "Anda harus masuk untuk melanjutkan percakapan."
                : "You must be logged in to continue your conversation."}
            </p>
          )}

          {error && (
            <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2 mt-2">
              <p className="font-bold mb-1">
                {locale === routing.defaultLocale
                  ? "Autentifikasi Gagal"
                  : "Authentication Failed"}
              </p>
              <p className="text-sm!">{error}</p>
            </div>
          )}
          {warning && (
            <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2 mt-2">
              <p className="font-bold mb-1">
                {locale === routing.defaultLocale
                  ? "Autentifikasi Gagal"
                  : "Authentication Failed"}
              </p>
              <p className="text-sm!">{warning}</p>
            </div>
          )}
        </div>

        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="*:mb-5">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold!">
                      {locale === routing.defaultLocale
                        ? "Kata Sandi"
                        : "Password"}
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
              <div className="flex w-full justify-end select-none">
                <button
                  type="button"
                  className="text-primary text-end"
                  onClick={() =>
                    router.push(
                      `/forgot-password${
                        form.getValues().email !== ""
                          ? `?email=${form.getValues().email}`
                          : ""
                      }`,
                    )
                  }
                >
                  <p className="text-sm! underline cursor-pointer">
                    {locale === routing.defaultLocale
                      ? "Lupa kata sandi"
                      : "I forgot my password"}
                  </p>
                </button>
              </div>
              <div className="h-16 mt-5">
                <Skeleton
                  className={cn(
                    "w-full h-16 rounded-md",
                    !captchaReady ? "block opacity-100" : "hidden opacity-0",
                  )}
                />

                <Turnstile
                  siteKey="0x4AAAAAACOWvPh9bptcSxI4"
                  onSuccess={(token: any) => {
                    setCaptchaInToken(token);
                  }}
                  options={{
                    theme: "light",
                    size: "flexible",
                    language: locale === routing.defaultLocale ? "id" : "en",
                  }}
                  onWidgetLoad={() => {
                    setCaptchaReady(true);
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={!captchaInToken || loading}
                className="w-full h-12 rounded-full"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <p>
                    {locale === routing.defaultLocale ? "Masuk" : "Sign In"}
                  </p>
                )}
              </Button>
            </form>
          </Form>
          <div className="flex justify-center items-center mb-5">
            <div className="border-b border-gray-300 w-full"></div>
            <p className="px-5 text-gray-500">
              {locale === routing.defaultLocale ? "atau" : "or"}
            </p>
            <div className="border-b border-gray-300 w-full"></div>
          </div>
          <Button
            type="button"
            className="w-full h-12 rounded-full flex items-center gap-2 mb-3 bg-white text-gray-800 border hover:bg-gray-50"
            onClick={handleGoogleSignIn}
          >
            <Image
              src={
                "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/google.svg"
              }
              width={20}
              height={20}
              alt="Google Logo"
            />
            <p>
              {locale === routing.defaultLocale
                ? "Lanjutkan dengan Google"
                : "Continue with Google"}
            </p>
          </Button>

          <Button
            variant="outline"
            type="button"
            className="w-full h-12 rounded-full flex items-center gap-2"
            onClick={() => router.push(`/${locale}/magic`)}
          >
            <ChevronsRight className="size-5" />{" "}
            <p>
              {locale === routing.defaultLocale
                ? "Masuk dengan Magic Link"
                : "Magic Link Sign In"}
            </p>
          </Button>
          <p className="text-muted-foreground text-center text-sm! mt-5">
            {locale === routing.defaultLocale
              ? "Belum punya akun?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() => router.push(`/${locale}/sign-up`)}
              className="text-health cursor-pointer underline"
            >
              {locale === routing.defaultLocale ? "Daftar." : "Sign Up."}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={cn("min-h-screen flex flex-col justify-center bg-white py-10")}
    >
      <ContainerWrap size="xxl">
        <div className="lg:top-5 lg:left-5 lg:mb-0 mb-5 lg:fixed w-fit">
          <Button
            className="w-full rounded-full flex items-center gap-2 mb-3 bg-white text-gray-500 border hover:bg-gray-50"
            onClick={() => router.back()}
          >
            <Undo2 /> {locale === routing.defaultLocale ? "Kembali" : "Back"}
          </Button>
        </div>
        <div className={cn("flex items-center justify-center")}>
          <div className={cn("w-full max-w-sm")}>
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

            <div>
              <h3
                className={cn(
                  "font-bold text-primary",
                  SignInToChat ? "mb-4" : "mb-10",
                )}
              >
                {locale === routing.defaultLocale
                  ? "Masuk"
                  : "Log In to Your Account"}
              </h3>
              {SignInToChat && (
                <p className="text-sm! text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Anda harus masuk untuk melanjutkan percakapan."
                    : "You must be logged in to continue your conversation."}
                </p>
              )}
              {error && (
                <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2 mt-2">
                  <p className="font-bold mb-1">
                    {locale === routing.defaultLocale
                      ? "Autentifikasi Gagal"
                      : "Authentication Failed"}
                  </p>
                  <p className="text-sm!">{error}</p>
                </div>
              )}
              {warning && (
                <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2 mt-2">
                  <p className="font-bold mb-1">
                    {locale === routing.defaultLocale
                      ? "Autentifikasi Gagal"
                      : "Authentication Failed"}
                  </p>
                  <p className="text-sm!">{warning}</p>
                </div>
              )}
            </div>

            <div>
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold!">
                          {locale === routing.defaultLocale
                            ? "Kata Sandi"
                            : "Password"}
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
                  <div className="flex w-full justify-end select-none">
                    <button
                      type="button"
                      className="text-primary text-end"
                      onClick={() =>
                        router.push(
                          `/forgot-password${
                            form.getValues().email !== ""
                              ? `?email=${form.getValues().email}`
                              : ""
                          }`,
                        )
                      }
                    >
                      <p className="text-sm! underline cursor-pointer">
                        {locale === routing.defaultLocale
                          ? "Lupa kata sandi"
                          : "I forgot my password"}
                      </p>
                    </button>
                  </div>
                  <div className="h-16">
                    <Skeleton
                      className={cn(
                        "w-full h-16 rounded-md",
                        !captchaReady
                          ? "block opacity-100"
                          : "hidden opacity-0",
                      )}
                    />

                    <Turnstile
                      siteKey="0x4AAAAAACOWvPh9bptcSxI4"
                      onSuccess={(token: any) => {
                        setCaptchaInToken(token);
                      }}
                      options={{
                        theme: "light",
                        size: "flexible",
                        language:
                          locale === routing.defaultLocale ? "id" : "en",
                      }}
                      onWidgetLoad={() => {
                        setCaptchaReady(true);
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!captchaInToken || loading}
                    className="w-full h-12 rounded-full"
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <p>
                        {locale === routing.defaultLocale ? "Masuk" : "Sign In"}
                      </p>
                    )}
                  </Button>
                </form>
              </Form>
              <div className="flex justify-center items-center mb-5">
                <div className="border-b border-gray-300 w-full"></div>
                <p className="px-5 text-gray-500">
                  {locale === routing.defaultLocale ? "atau" : "or"}
                </p>
                <div className="border-b border-gray-300 w-full"></div>
              </div>
              <Button
                type="button"
                className="w-full h-12 rounded-full flex items-center gap-2 mb-3 bg-white text-gray-800 border hover:bg-gray-50"
                onClick={handleGoogleSignIn}
              >
                <Image
                  src={
                    "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/google.svg"
                  }
                  width={20}
                  height={20}
                  alt="Google Logo"
                />
                <p>
                  {locale === routing.defaultLocale
                    ? "Lanjutkan dengan Google"
                    : "Continue with Google"}
                </p>
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full h-12 rounded-full flex items-center gap-2"
                onClick={() => router.push(`/${locale}/magic`)}
              >
                <ChevronsRight className="size-5" />{" "}
                <p>
                  {locale === routing.defaultLocale
                    ? "Masuk dengan Magic Link"
                    : "Magic Link Sign In"}
                </p>
              </Button>
              <p className="text-muted-foreground text-center text-sm! mt-5">
                {locale === routing.defaultLocale
                  ? "Belum punya akun?"
                  : "Don't have an account?"}{" "}
                <span
                  onClick={() => router.push(`/${locale}/sign-up`)}
                  className="text-health cursor-pointer underline"
                >
                  {locale === routing.defaultLocale ? "Daftar." : "Sign Up."}
                </span>{" "}
              </p>
            </div>
          </div>
        </div>
      </ContainerWrap>
    </div>
  );
};

export default SignInClient;
