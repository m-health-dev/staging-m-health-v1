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
import Link from "next/link";
import { EmailSignUp } from "@/lib/auth/auth";

const SignUpClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

  const form = useForm<z.infer<typeof AuthSignUpSchema>>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof AuthSignUpSchema>) {
    setLoading(true);
    const signingUp = await EmailSignUp({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    });

    if (signingUp) {
      toast("Log", {
        description: (
          <pre className="mt-2 rounded-md text-wrap wrap-anywhere line-clamp-30 space-y-4">
            <div>
              <p className="mb-2 text-sm! text-muted-foreground">Sent</p>
              <code>{JSON.stringify(data, null, 2)}</code>
            </div>
            <div>
              <p className="mb-2 text-sm! text-muted-foreground">Response</p>
              <code>{JSON.stringify(signingUp, null, 2)}</code>
            </div>
          </pre>
        ),
      });
    } else {
      toast.error("Sign Up Failed", {
        description: "If you encounter issues, please contact support.",
      });
    }
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
        <div className="flex items-center justify-center lg:min-h-screen 3xl:min-h-[calc(100vh-80px)] bg-white py-10 mt-5 mb-10 rounded-4xl p-5">
          <div className="md:max-w-sm w-full col-span-1">
            <h3 className="font-bold text-primary mb-10">
              Create Your Account
            </h3>
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
                        Full Name
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
                <div>
                  <p className="text-muted-foreground text-sm!">
                    By signing up you agree to the{" "}
                    <span
                      className="text-health underline cursor-pointer"
                      onClick={() => router.push("/terms-of-service")}
                    >
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span
                      className="text-health underline cursor-pointer"
                      onClick={() => router.push("/privacy-policy")}
                    >
                      Privacy Policy
                    </span>
                  </p>
                </div>
                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? <Spinner /> : <p>Sign Up</p>}
                </Button>
                <div className="flex justify-center items-center">
                  <div className="border-b border-gray-300 w-full"></div>
                  <p className="px-5 text-gray-500">or</p>
                  <div className="border-b border-gray-300 w-full"></div>
                </div>
                <Link href={`${apiBaseUrl}/auth/google/redirect`}>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-12 rounded-full"
                  >
                    <p>
                      <FontAwesomeIcon icon={faGoogle} /> Sign Up with Google
                    </p>
                  </Button>
                </Link>
              </form>
            </Form>
            <p className="text-muted-foreground text-sm! mt-5">
              Already have an account?{" "}
              <span
                onClick={() => router.push(`/sign-in`)}
                className="text-health cursor-pointer underline"
              >
                Sign In
              </span>
              .
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

export default SignUpClient;
