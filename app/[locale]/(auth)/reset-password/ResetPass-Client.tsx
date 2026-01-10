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
import { EyeClosed, Eye, EyeOff } from "lucide-react";
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

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setLoading(true);

    const response = await resetPasswordAction(data);

    if (response?.warning) {
      setLoading(false);
      setWarning(locale === "id" ? response.warning.id : response.warning.en);
    } else if (response?.error) {
      setLoading(false);
      setError(locale === "id" ? response.error.id : response.error.en);
    } else if (response?.success) {
      setLoading(false);
      setSuccess(`${response.success}`);
      toast.success(`${response.success}`);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <ContainerWrap size="xl">
        <div className="flex min-h-screen items-center justify-center">
          <div className="md:max-w-sm w-full col-span-1">
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
            <h3 className="font-bold text-primary mb-2">
              {locale === "id"
                ? "Atur Ulang Kata Sandi Anda"
                : "Reset Your Password"}
            </h3>
            <p className="mb-8 text-sm! text-muted-foreground">
              {locale === "id"
                ? "Anda hanya memiliki 3 kali percobaan untuk memulihkan akun Anda. Setelah itu, Anda perlu menghubungi dukungan."
                : "You only have 3 attempts to recover your account. After that, you will need to contact support."}
            </p>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === "id" ? "Permintaan Gagal" : "Request Failed"}
                </p>
                <p className="text-sm!">{error}</p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === "id" ? "Permintaan Gagal" : "Request Failed"}
                </p>
                <p className="text-sm!">{warning}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-500 p-4 border border-green-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">
                  {locale === "id"
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
                        {locale === "id" ? "Kata Sandi Baru" : "New Password"}
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
                        {locale === "id"
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

                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <p>
                      {locale === "id"
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

export default ResetPassClient;
