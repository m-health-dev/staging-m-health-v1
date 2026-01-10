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
import { AuthSignUpSchema } from "@/lib/zodSchema";
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
import Link from "next/link";

import { useLocale } from "next-intl";
import { signUpAction, signWithGoogle } from "../actions/auth.actions";

const SignUpClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();
  const redirectData = params.get("redirect") || `/${locale}/dashboard`;

  const apiBaseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
      : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

  const form = useForm<z.infer<typeof AuthSignUpSchema>>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await signWithGoogle(redirectData);

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

  async function onSubmit(data: z.infer<typeof AuthSignUpSchema>) {
    setLoading(true);
    const response = await signUpAction(data);

    if (response?.error) {
      setLoading(false);
      setError(locale === "id" ? response.error.id : response.error.en);
      // toast.error(`Registrasi Gagal`, {
      //   description: `${response.error}`,
      // });
    } else if (response?.warning) {
      setLoading(false);
      setWarning(locale === "id" ? response.warning.id : response.warning.en);
      // toast.warning(`Registrasi Gagal`, {
      //   description: `${response.warning}`,
      // });
    } else if (response?.success) {
      setLoading(false);
      setSuccess(locale === "id" ? response.success.id : response.success.en);
      // toast.success(`Registrasi Berhasil`, {
      //   description: `${response.success}`,
      // });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white py-10">
      <ContainerWrap size="xl">
        <div className="flex justify-center items-center">
          <div className="max-w-sm">
            <Link href={`/${locale}`}>
              <Image
                src={
                  "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
                }
                width={180}
                height={60}
                className="object-contain mb-8 flex justify-center items-center"
                alt="M-Health Logo"
              />
            </Link>
            <h3 className="font-bold text-primary mb-10">
              {locale === "id" ? "Buat Akun Baru" : "Create a New Account"}
            </h3>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === "id"
                    ? "Registrasi Akun Gagal"
                    : "Account Registration Failed"}
                </p>
                <p className="text-sm!">{error}</p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === "id"
                    ? "Registrasi Akun Gagal"
                    : "Account Registration Failed"}
                </p>
                <p className="text-sm!">{warning}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-500 p-4 border border-green-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === "id"
                    ? "Registrasi Akun Berhasil"
                    : "Account Registration Successful"}
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
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        {locale === "id" ? "Nama Lengkap" : "Full Name"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        {locale === "id" ? "Kata Sandi" : "Password"}
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
                <div>
                  <p className="text-muted-foreground text-sm!">
                    {locale === "id"
                      ? "Dengan mendaftar, kamu setuju dengan"
                      : "By signing up you agree to our"}{" "}
                    <span
                      className="text-health underline cursor-pointer"
                      onClick={() => router.push("/terms-of-service")}
                    >
                      {locale === "id" ? "Syarat Layanan" : "Terms of Service"}
                    </span>{" "}
                    {locale === "id" ? "dan" : "and"}{" "}
                    <span
                      className="text-health underline cursor-pointer"
                      onClick={() => router.push("/privacy")}
                    >
                      {locale === "id"
                        ? "Kebijakan Privasi"
                        : "Privacy Policy."}
                    </span>
                    {locale === "id" && "kami."}
                  </p>
                </div>
                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <p>{locale === "id" ? "Daftar" : "Sign Up"}</p>
                  )}
                </Button>
              </form>
            </Form>
            <div className="flex justify-center items-center mb-5">
              <div className="border-b border-gray-300 w-full"></div>
              <p className="px-5 text-gray-500">
                {locale === "id" ? "atau" : "or"}
              </p>
              <div className="border-b border-gray-300 w-full"></div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-12 rounded-full flex items-center"
              onClick={handleGoogleSignIn}
            >
              <FontAwesomeIcon icon={faGoogle} />{" "}
              <p>
                {locale === "id"
                  ? "Daftar dengan Google"
                  : "Sign Up with Google"}
              </p>
            </Button>
            <p className="text-muted-foreground text-sm! mt-5 text-center">
              {locale === "id"
                ? "Sudah punya akun?"
                : "Already have an account?"}{" "}
              <span
                onClick={() => router.push(`/${locale}/sign-in`)}
                className="text-health cursor-pointer underline"
              >
                {locale === "id" ? "Masuk" : "Sign In"}
              </span>
              .
            </p>
          </div>
        </div>
      </ContainerWrap>
    </div>
  );
};

export default SignUpClient;
