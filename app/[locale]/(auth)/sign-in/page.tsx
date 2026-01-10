import React from "react";
import SignInClient from "./SignIn-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";
import { createClient } from "@/utils/supabase/client";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  return {
    title: `${
      locale === routing.defaultLocale ? "Masuk" : "Sign In"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
        : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Masuk" : "Sign In"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
          : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Masuk" : "Sign In"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
              : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
          )}&path=${encodeURIComponent("m-health.id/sign-in")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const SignInPage = async () => {
  return <SignInClient />;
};

export default SignInPage;
