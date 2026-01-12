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
import { unstable_cache } from "next/cache";

// Use ISR with revalidation instead of force-dynamic for better performance
export const revalidate = 60; // Revalidate every 60 seconds

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

  // Cache metadata strings to avoid recomputing
  const title =
    locale === routing.defaultLocale
      ? "Konsultasi dengan AI"
      : "Consult with AI";
  const description =
    locale === routing.defaultLocale
      ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
      : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That's why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way.";

  return {
    title: `${title} - M HEALTH`,
    description,
    openGraph: {
      title: `${title} - M HEALTH`,
      description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(
            description
          )}&path=${encodeURIComponent("m-health.id/home")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

// Cache public data fetching to reduce database load
const getCachedPublicData = unstable_cache(
  async () => {
    const [packagesResult, medicalResult, wellnessResult] = await Promise.all([
      getAllPublicPackages(1, 3),
      getAllPublicMedical(1, 3),
      getAllPublicWellness(1, 3),
    ]);

    return {
      packages: Array.isArray(packagesResult?.data) ? packagesResult.data : [],
      medical: Array.isArray(medicalResult?.data) ? medicalResult.data : [],
      wellness: Array.isArray(wellnessResult?.data) ? wellnessResult.data : [],
    };
  },
  ["public-data-home"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["public-data"],
  }
);

export default async function Home() {
  const cookieStore = await cookies();
  const publicID = cookieStore.get("mhealth_public_id")?.value;

  const supabase = await createClient();

  // Fetch all initial data in parallel, including cached public data
  const [
    {
      data: { session },
    },
    { packages, medical, wellness },
    locale,
    t,
  ] = await Promise.all([
    supabase.auth.getSession(),
    getCachedPublicData(),
    getLocale(),
    getTranslations("utility"),
  ]);

  // Get user info in parallel with chat history
  const { data: user } = await supabase.auth.getUser();
  const checkUser = user.user;
  const userID = checkUser?.id;

  // Fetch user-specific data in parallel
  const [historyData, userData] = await Promise.all([
    checkUser
      ? getChatHistoryByUserID(userID!, 1, 10)
      : publicID
      ? getChatHistory(publicID, 1, 10)
      : Promise.resolve({ data: [], total: 0 }),
    session?.access_token
      ? getUserInfo(session.access_token).catch((e) => {
          console.error("User info fetch failed:", e);
          return null;
        })
      : Promise.resolve(null),
  ]);

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
