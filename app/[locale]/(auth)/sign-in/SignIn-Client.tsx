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
import { AuthSignInUpSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

const SignInClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof AuthSignInUpSchema>>({
    resolver: zodResolver(AuthSignInUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof AuthSignInUpSchema>) {
    toast("Signed In As :", {
      description: (
        <pre className="mt-2 rounded-md text-wrap wrap-anywhere line-clamp-30">
          <code className="">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <>
      <ContainerWrap
        size="xl"
        className="flex items-center justify-center 3xl:min-h-[calc(100vh-80px)] min-h-screen bg-white my-10 rounded-4xl"
      >
        <div className="md:max-w-sm w-full">
          <Image
            src={"/mhealth_logo.PNG"}
            width={180}
            height={60}
            className="object-contain mb-20"
            alt="M-Health Logo"
          />
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
                <p>Sign In</p>
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
                onClick={() => router.push("/auth/sign-in/google")}
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
              onClick={() => router.push(`/sign-up`)}
              className="text-health font-semibold cursor-pointer underline"
            >
              Sign Up
            </span>{" "}
            now.
          </p>
        </div>
        <div>
          <Image
            src={image.full}
            width={600}
            height={600}
            alt={image.alt}
            className="ml-20 rounded-4xl shadow aspect-square w-full h-full object-cover object-center lg:flex hidden"
          />
        </div>
      </ContainerWrap>
    </>
  );
};

export default SignInClient;
