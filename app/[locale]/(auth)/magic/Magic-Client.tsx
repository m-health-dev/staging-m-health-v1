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
import { handleSendMagicLinkAction } from "../actions/auth.actions";
import Image from "next/image";
import z from "zod";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Undo2 } from "lucide-react";

export const RequestMagicLinkSchema = z.object({
  email: z.email(),
});

const MagicLinkClient = ({ locale }: { locale: string }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [requested, setRequested] = React.useState(false);

  const [captchaMagicToken, setCaptchaMagicToken] = React.useState<string>("");
  const [captchaReady, setCaptchaReady] = React.useState(false);

  const captcha = React.useRef<any>(null);

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

    const response = await handleSendMagicLinkAction(data, captchaMagicToken);

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

    // if (captcha.current) {
    //   captcha.current.resetCaptcha();
    // }

    form.reset();

    if (response.error)
      setError(
        locale === routing.defaultLocale
          ? response.error.id
          : response.error.en,
      );
    if (response.warning)
      setWarning(
        locale === routing.defaultLocale
          ? response.warning.id
          : response.warning.en,
      );
    if (response.success)
      setSuccess(
        locale === routing.defaultLocale
          ? response.success.id
          : response.success.en,
      );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white w-full">
      <ContainerWrap size="xl">
        <div className="lg:top-5 lg:left-5 lg:mb-0 mb-5 lg:fixed w-fit">
          <Button
            className="w-full rounded-full flex items-center gap-2 mb-3 bg-white text-gray-500 border hover:bg-gray-50"
            onClick={() => router.back()}
          >
            <Undo2 /> {locale === routing.defaultLocale ? "Kembali" : "Back"}
          </Button>
        </div>
        <div className="flex items-center justify-center w-full">
          <div className="max-w-sm w-full">
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
            <div className="mb-10">
              <h3 className="font-bold text-primary mb-2">
                {locale === routing.defaultLocale
                  ? "Masuk dengan Tautan Ajaib"
                  : "Sign In with Magic Link"}
              </h3>
            </div>

            {error && (
              <AlertBox
                type="error"
                title={
                  locale === routing.defaultLocale
                    ? "Permintaan Gagal"
                    : "Request Failed"
                }
                message={error}
              />
            )}
            {warning && (
              <AlertBox
                type="warning"
                title={
                  locale === routing.defaultLocale
                    ? "Permintaan Gagal"
                    : "Request Failed"
                }
                message={warning}
              />
            )}
            {success && (
              <AlertBox
                type="success"
                title={
                  locale === routing.defaultLocale
                    ? "Permintaan Berhasil"
                    : "Request Successful"
                }
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
                      setCaptchaMagicToken(token);
                    }}
                    theme="light"
                    size="normal"
                    languageOverride={
                      locale === routing.defaultLocale ? "id" : "en"
                    }
                    onLoad={() => {
                      setCaptchaReady(true);
                    }}
                    onExpire={() => setCaptchaMagicToken("")}
                    onError={() => setCaptchaMagicToken("")}
                  /> */}

                  <Turnstile
                    ref={captcha}
                    siteKey="0x4AAAAAACOWvPh9bptcSxI4"
                    onSuccess={(token: any) => {
                      setCaptchaMagicToken(token);
                    }}
                    options={{
                      theme: "light",
                      size: "flexible",
                      language: locale === routing.defaultLocale ? "id" : "en",
                    }}
                    onWidgetLoad={() => {
                      setCaptchaReady(true);
                    }}
                    onExpire={() => setCaptchaMagicToken("")}
                    onError={() => setCaptchaMagicToken("")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!captchaMagicToken || loading}
                  className="w-full h-12 rounded-full"
                >
                  {loading ? (
                    <Spinner />
                  ) : locale === routing.defaultLocale ? (
                    "Minta Tautan Ajaib"
                  ) : (
                    "Request Magic Link"
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-muted-foreground text-sm! mt-5 text-center">
              {locale === routing.defaultLocale
                ? "Belum punya akun?"
                : "Don't have an account?"}{" "}
              <span
                onClick={() => router.push("/sign-up")}
                className="text-health cursor-pointer underline"
              >
                {locale === routing.defaultLocale ? "Daftar." : "Sign Up."}
              </span>{" "}
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
