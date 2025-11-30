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
import {
  forgotPasswordAction,
  resetPasswordAction,
} from "../actions/auth.actions";

const ResetPassClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
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
      setWarning(response.warning);
      // toast.warning(`Gagal Mengirim`, {
      //   description: `${response.warning}`,
      // });
    } else if (response?.error) {
      setLoading(false);
      setError(response.error);
      // toast.error(`Gagal Mengirim`, {
      //   description: `${response.error}`,
      // });
    } else if (response?.success) {
      setLoading(false);
      setSuccess(`${response.success}`);
      // toast.success(`Berhasil Terkirim`, {
      //   description: `${response.success}`,
      // });
    }
    setLoading(false);

    // toast("Signed In As :", {
    //   description: (
    //     <pre className="mt-2 rounded-md text-wrap wrap-anywhere line-clamp-30">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <>
      <Image
        src={
          "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
        }
        width={180}
        height={60}
        className="object-contain mt-5 flex justify-center items-center mx-auto"
        alt="M-Health Logo"
      />
      <ContainerWrap size="xl">
        <div className="flex items-center justify-center lg:min-h-screen 3xl:min-h-[calc(100vh-80px)] bg-white py-10 mt-5 mb-10 p-5 rounded-4xl">
          <div className="md:max-w-sm w-full col-span-1">
            <h3 className="font-bold text-primary mb-2">Reset Your Password</h3>
            <p className="mb-8 text-sm! text-muted-foreground">
              You only have 3 attempts to recover your account. After that, you
              will need to contact support.
            </p>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 border border-red-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">Permintaan Gagal</p>
                <p className="text-sm!">{error}</p>
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 text-yellow-500 p-4 border border-yellow-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">Permintaan Gagal</p>
                <p className="text-sm!">{warning}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-500 p-4 border border-green-500 rounded-2xl mb-2">
                <p className="font-bold mb-1">Permintaan Berhasil</p>
                <p className="text-sm!">{success}</p>
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-sm space-y-5"
              >
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold!">
                        Confirm Password
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
                  {loading ? <Spinner /> : <p>Reset Password</p>}
                </Button>

                {/* <div className="mt-8">
                  <HelpLink />
                  <p className="!text-xs text-muted-foreground mt-2">
                    Pastikan jaringan internet yang kamu gunakan aman. Kami
                    menyarankan kamu untuk menggunakan jaringan internet yang
                    kamu percaya.
                  </p>
                </div> */}
              </form>
            </Form>
          </div>
        </div>
      </ContainerWrap>
    </>
  );
};

export default ResetPassClient;
