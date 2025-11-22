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

const ForgotPassClient = ({ image }: { image: any }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ForgotPassSchema>>({
    resolver: zodResolver(ForgotPassSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPassSchema>) {
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
              Recover Your Account
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
                <div>
                  <p className="text-muted-foreground text-sm!">
                    You only have 3 attempts to recover your account. After
                    that, you will need to contact support.
                  </p>
                </div>
                <Button type="submit" className="w-full h-12 rounded-full">
                  {loading ? <Spinner /> : <p>Request One Time Password</p>}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </ContainerWrap>
    </>
  );
};

export default ForgotPassClient;
