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
import { OTPSignInSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  handleSendMagicLinkAction,
  handleSendOTPAction,
  handleVerifyOTPAction,
} from "../actions/auth.actions";
import Image from "next/image";
import z from "zod";

export const RequestMagicLinkSchema = z.object({
  email: z.email(),
});

const MagicLinkClient = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [requested, setRequested] = React.useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const form = useForm({
    resolver: zodResolver(RequestMagicLinkSchema),
    defaultValues: { email: "" },
  });

  // Pastikan tidak terjadi infinite re-render
  React.useEffect(() => {
    const email = params.get("email");
    setRequested(Boolean(email));

    if (email) {
      form.setValue("email", email);
    }
  }, [params, form]);

  // Handler kirim OTP
  async function onSubmitSend(data: z.infer<typeof RequestMagicLinkSchema>) {
    resetMessages();
    setLoading(true);

    const response = await handleSendMagicLinkAction(data);

    handleResponse(response);
    setLoading(false);
  }

  function resetMessages() {
    setError("");
    setWarning("");
    setSuccess("");
  }

  function handleResponse(response: any) {
    if (!response) return;

    if (response.error) setError(response.error);
    if (response.warning) setWarning(response.warning);
    if (response.success) setSuccess(response.success);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white w-full">
      <ContainerWrap size="xl">
        <div className="flex items-center justify-center w-full">
          <div className="max-w-sm w-full">
            <Image
              src="https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
              width={180}
              height={60}
              className="object-contain mb-8 flex justify-center items-center"
              alt="M-Health Logo"
            />
            <div className="mb-10">
              <h3 className="font-bold text-primary mb-2">
                Magic Link Request
              </h3>
            </div>

            {error && (
              <AlertBox type="error" title="Permintaan Gagal" message={error} />
            )}
            {warning && (
              <AlertBox
                type="warning"
                title="Permintaan Gagal"
                message={warning}
              />
            )}
            {success && (
              <AlertBox
                type="success"
                title="Permintaan Berhasil"
                message={success}
              />
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitSend)}
                className="*:mb-5 mt-5 w-full"
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

                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? <Spinner /> : "Request Magic Link"}
                </Button>
              </form>
            </Form>

            <p className="text-muted-foreground text-sm! mt-5 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/sign-up")}
                className="text-health cursor-pointer underline"
              >
                Sign Up
              </span>{" "}
              now.
            </p>
          </div>
        </div>
      </ContainerWrap>
    </div>
  );
};

export default MagicLinkClient;

/* --- COMPONENT PEMBANTU --- */
const AlertBox = ({
  type,
  title,
  message,
}: {
  type: "error" | "warning" | "success";
  title: string;
  message: string;
}) => {
  const colors =
    type === "error"
      ? "bg-red-50 text-red-500 border-red-500"
      : type === "warning"
      ? "bg-yellow-50 text-yellow-500 border-yellow-500"
      : "bg-green-50 text-green-500 border-green-500";

  return (
    <div className={`${colors} p-4 border rounded-2xl mb-2`}>
      <p className="font-bold mb-1">{title}</p>
      <p className="text-sm!">{message}</p>
    </div>
  );
};
