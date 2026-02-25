import CurrentEvents from "@/components/home/CurrentEvents";
import HomeLazySections from "@/components/home/HomeLazySections";
import Jumbotron from "@/components/home/Jumbotron";
import OurNews from "@/components/home/OurNews";
import PopularMedical from "@/components/home/PopularMedical";
import PopularPackage from "@/components/home/PopularPackage";
import PopularProgram from "@/components/home/PopularProgram";
import CallToAction from "@/components/utility/CallToAction";
import Wrapper from "@/components/utility/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";
import { getAllHomeData } from "@/lib/home/get-home-data";
import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { Suspense } from "react";

// Force dynamic rendering - no cache
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  return {
    title: `${
      locale === routing.defaultLocale ? "Beranda" : "Home"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
        : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Beranda" : "Home"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
          : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Beranda" : "Home",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
              : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way.",
          )}&path=${encodeURIComponent("m-health.id/home")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const HomePage = async () => {
  const locale = await getLocale();
  return (
    <Wrapper>
      {/* Suspense wraps data-dependent content for instant shell render + streaming */}
      <Suspense fallback={<HomePageSkeleton />}>
        <HomeContent locale={locale} />
      </Suspense>
    </Wrapper>
  );
};

export default HomePage;

const HomePageSkeleton = () => (
  <ContainerWrap size="xl" className="py-20">
    <Skeleton className="w-full h-[400px] rounded-2xl mb-8" />
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-10">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
      ))}
    </div>
  </ContainerWrap>
);

const HomeContent = async ({ locale }: { locale: string }) => {
  const { hero, packages, wellness, medical, events, articles } =
    await getAllHomeData();
  return (
    <>
      {/* Jumbotron tetap load langsung karena above the fold */}
      <Jumbotron data={hero} locale={locale} />

      <HomeLazySections
        popularPackage={<PopularPackage data={packages} locale={locale} />}
        popularProgram={<PopularProgram data={wellness} locale={locale} />}
        popularMedical={<PopularMedical data={medical} locale={locale} />}
        currentEvents={<CurrentEvents data={events} locale={locale} />}
        ourNews={<OurNews data={articles} locale={locale} />}
        callToAction={<CallToAction />}
      />
    </>
  );
};
