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
import { AuthSignInSchema } from "@/lib/zodSchema";
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
import { signInAction, signWithGoogle } from "@/lib/auth/auth";
import { sign } from "crypto";
import { useLocale } from "next-intl";

const SignInClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();
  const redirectData = params.get("redirect") || "/dashboard";

  const form = useForm<z.infer<typeof AuthSignInSchema>>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: "",
      password: "",
      redirect: redirectData?.toString() || `/${locale}/dashboard`,
    },
  });

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await signWithGoogle(redirectData);

    if (response?.error) {
      toast.error(`Verifikasi Gagal`, {
        description: `${response.error}`,
      });
    } else if (response?.warning) {
      toast.warning(`Verifikasi Gagal`, {
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
      toast.error(`Autentifikasi Gagal`, {
        description: `${res.error}`,
      });
    } else if (res?.warning) {
      setLoading(false);
      toast.warning(`Autentifikasi Gagal`, {
        description: `${res.warning}`,
      });
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
        src={"/mhealth_logo.PNG"}
        width={180}
        height={60}
        className="object-contain mt-5 flex justify-center items-center mx-auto"
        alt="M-Health Logo"
      />
      <ContainerWrap size="xl">
        <div className="flex items-center justify-center lg:min-h-screen 3xl:min-h-[calc(100vh-80px)] bg-white py-10 mt-5 mb-10 p-5 rounded-4xl">
          <div className="md:max-w-sm w-full col-span-1">
            <h3 className="font-bold text-primary mb-10">
              Log In to Your Account
            </h3>
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
                <div className="flex w-full justify-end">
                  <button
                    type="button"
                    className="text-primary text-end"
                    onClick={() =>
                      router.push(`/forgot-password?access=${uuid()}`)
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
                <div className="flex justify-center items-center">
                  <div className="border-b border-gray-300 w-full"></div>
                  <p className="px-5 text-gray-500">or</p>
                  <div className="border-b border-gray-300 w-full"></div>
                </div>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-12 rounded-full"
                  onClick={handleGoogleSignIn}
                >
                  <p>
                    <FontAwesomeIcon icon={faGoogle} /> Sign In with Google
                  </p>
                </Button>
              </form>
            </Form>
            <p className="text-muted-foreground text-sm!">
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
              src={image.full}
              width={320}
              height={320}
              unoptimized
              alt={image.alt}
              className="ml-20 rounded-4xl shadow aspect-square min-w-2xl max-w-2xl h-full object-cover object-center lg:flex hidden"
            />
          </div>
        </div>
      </ContainerWrap>
    </>
  );
};

export default SignInClient;
