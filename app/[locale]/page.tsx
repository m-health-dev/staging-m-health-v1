import ChatContent from "@/components/chatbot/ChatContent";
import SnowFall from "@/components/snow-fall";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import {
  getChatHistory,
  getChatHistoryByUserID,
} from "@/lib/chatbot/getChatActivity";
import { getAllMedical, getAllPublicMedical } from "@/lib/medical/get-medical";
import {
  getAllPackages,
  getAllPublicPackages,
} from "@/lib/packages/get-packages";
import {
  getAllPublicWellness,
  getAllWellness,
} from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
      locale === routing.defaultLocale
        ? "Konsultasi dengan AI"
        : "Consult with AI"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
        : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale
          ? "Konsultasi dengan AI"
          : "Consult with AI"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
          : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Konsultasi dengan AI"
              : "Consult with AI"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
              : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
          )}&path=${encodeURIComponent("m-health.id/home")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

export default async function Home() {
  const cookieStore = await cookies();
  const publicID = cookieStore.get("mhealth_public_id")?.value;

  const supabase = await createClient();

  const t = await getTranslations("utility");

  const [
    {
      data: { session },
    },
    packagesResult,
    medicalResult,
    wellnessResult,
    locale,
  ] = await Promise.all([
    supabase.auth.getSession(),
    getAllPublicPackages(1, 3),
    getAllPublicMedical(1, 3),
    getAllPublicWellness(1, 3),
    getLocale(),
  ]);

  const packages = Array.isArray(packagesResult?.data)
    ? packagesResult.data
    : [];

  const medical = Array.isArray(medicalResult?.data) ? medicalResult.data : [];

  const wellness = Array.isArray(wellnessResult?.data)
    ? wellnessResult.data
    : [];

  const { data: user, error } = await supabase.auth.getUser();

  const checkUser = user.user;

  let userID;

  if (checkUser) {
    userID = user.user?.id;
  }

  const historyData = checkUser
    ? await getChatHistoryByUserID(userID!, 1, 10)
    : publicID
    ? await getChatHistory(publicID, 1, 10)
    : { data: [], total: 0 };

  let userData = null;

  if (session?.access_token) {
    try {
      userData = await getUserInfo(session.access_token);
    } catch (e) {
      console.error("User info fetch failed:", e);
    }
  }

  // console.log({ checkUser, session, userID, userData, publicID, historyData });

  return (
    <>
      <ChatContent
        packages={packages}
        medical={medical}
        wellness={wellness}
        initialHistory={
          Array.isArray(historyData?.data?.data) ? historyData.data.data : []
        }
        publicIDFetch={publicID}
        user={userData}
        locale={locale}
        labels={{
          delete: t("delete"),
          cancel: t("cancel"),
        }}
      />
    </>
  );
}
