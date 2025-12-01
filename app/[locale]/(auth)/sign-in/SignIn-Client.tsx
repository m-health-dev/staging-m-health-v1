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
import { EyeClosed, Eye, ChevronsRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";

import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { sign } from "crypto";
import { useLocale } from "next-intl";
import {
  forgotPasswordAction,
  signInAction,
  signWithGoogle,
} from "../actions/auth.actions";

const SignInClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();
  const redirectData = params.get("redirect") || `/${locale}/dashboard`;
  const emailData = params.get("email");
  const resetData = params.get("reset");
  const recordResetData = params.get("record");

  useEffect(() => {
    const newRequestCount = 3 - Number(recordResetData);
    if (resetData === "success") {
      toast.success("Berhasil Memulihkan Akun", {
        description: `Kata sandi telah diperbarui, selalu ingat kata sandi yang baru ya! ${
          newRequestCount === 0
            ? `Karena, sisa kuota untuk memulihkan akunmu telah habis.`
            : `Karena, sisa kuota untuk memulihkan akunmu hanya tersisa ${newRequestCount} kali.`
        } `,
        duration: 30000,
      });
    }
  }, [recordResetData]);

  const form = useForm<z.infer<typeof AuthSignInSchema>>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: emailData || "",
      password: "",
      redirect: redirectData?.toString(),
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

  async function onSubmit(data: z.infer<typeof AuthSignInSchema>) {
    setLoading(true);
    const res = await signInAction(data);

    if (res?.error) {
      setLoading(false);
      setError(res?.error);
    } else if (res?.warning) {
      setLoading(false);
      setWarning(res?.warning);
    } else {
      setLoading(false);
      return;
    }
    // } else {
    //   toast.error("Sign In Failed. Please check your credentials.", {
    //     description: "If you encounter issues, please contact support.",
    //   });
    // }
    setLoading(false);
  }

  return (
    <>
      <Image
        src={
          "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
        }
        width={180}
        height={60}
        className="object-contain my-8 flex justify-center items-center mx-auto"
        alt="M-Health Logo"
      />
      <ContainerWrap size="xl">
        <div className="flex items-center justify-center lg:min-h-screen 3xl:min-h-[calc(100vh-80px)] bg-white py-10 mt-5 mb-10 p-5 rounded-4xl">
          <div className="md:max-w-sm w-full col-span-1">
            <h3 className="font-bold text-primary mb-10">
              Log In to Your Account
            </h3>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">Autentifikasi Gagal</p>
                <p className="text-sm!">{error}</p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">Autentifikasi Gagal</p>
                <p className="text-sm!">{warning}</p>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Password
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
                        }`
                      )
                    }
                  >
                    <p className="text-sm! underline cursor-pointer">
                      I forgot my password
                    </p>
                  </button>
                </div>
                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? <Spinner /> : <p>Sign In</p>}
                </Button>
              </form>
            </Form>
            <div className="flex justify-center items-center mb-5">
              <div className="border-b border-gray-300 w-full"></div>
              <p className="px-5 text-gray-500">or</p>
              <div className="border-b border-gray-300 w-full"></div>
            </div>
            <Button
              variant="outline"
              type="button"
              className="w-full h-12 rounded-full flex items-center gap-2 mb-3"
              onClick={handleGoogleSignIn}
            >
              <FontAwesomeIcon icon={faGoogle} /> <p>Sign In with Google</p>
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full h-12 rounded-full flex items-center gap-2"
              onClick={() => router.push(`/${locale}/magic`)}
            >
              <ChevronsRight className="size-5" /> <p>Magic Sign In</p>
            </Button>
            <p className="text-muted-foreground text-center text-sm! mt-5">
              Don't have an account?{" "}
              <span
                onClick={() => router.push(`/${locale}/sign-up`)}
                className="text-health cursor-pointer underline"
              >
                Sign Up
              </span>{" "}
              now.
            </p>
          </div>
          <div className="col-span-2">
            <Image
              src={image}
              width={640}
              height={640}
              unoptimized
              alt={image}
              className="ml-20 rounded-4xl shadow aspect-square min-w-2xl max-w-2xl h-full object-cover object-center lg:flex hidden"
            />
          </div>
        </div>
      </ContainerWrap>
    </>
  );
};

export default SignInClient;
