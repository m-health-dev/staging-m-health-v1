"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  OTPSignInSchema,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPClient = ({ image }: { image: any }) => {
  const [showOTP, setShowOTP] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof OTPSignInSchema>>({
    resolver: zodResolver(OTPSignInSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function onSubmit(data: z.infer<typeof OTPSignInSchema>) {
    setLoading(true);

    // Delay 2 detik
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);

    toast("Signed In As :", {
      description: (
        <pre className="mt-2 rounded-md text-wrap wrap-anywhere line-clamp-30">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
            <div className="mb-10">
              <h3 className="font-bold text-primary mb-2">One Time Password</h3>
              <p className="text-muted-foreground text-sm!">
                After OTP sent to your email, you will be able to input the OTP
                to sign in.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="*:mb-5 mt-5"
              >
                {!showOTP && (
                  <>
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
                    <Button
                      type="button"
                      onClick={() => setShowOTP(true)}
                      className="w-full h-12 rounded-full"
                    >
                      {loading ? <Spinner /> : <p>Request One Time Password</p>}
                    </Button>
                  </>
                )}

                {showOTP && (
                  <>
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold!">
                            One-Time Password
                          </FormLabel>
                          <FormControl>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormDescription>
                            Please enter the one-time password sent to your
                            email.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-12 rounded-full">
                      {loading ? <Spinner /> : <p>Sign In</p>}
                    </Button>
                  </>
                )}
              </form>
            </Form>
            <p className="text-muted-foreground text-sm!">
              Don't have an account?{" "}
              <span
                onClick={() => router.push(`/sign-up`)}
                className="text-health cursor-pointer underline"
              >
                Sign Up
              </span>{" "}
              now.
            </p>
          </div>
        </div>
      </ContainerWrap>
    </>
  );
};

export default OTPClient;
