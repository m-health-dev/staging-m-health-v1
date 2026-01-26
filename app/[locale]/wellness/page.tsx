import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React, { Suspense } from "react";

import { getLocale, getTranslations } from "next-intl/server";
import {
  getAllPackages,
  getAllPublicPackages,
} from "@/lib/packages/get-packages";
import { PackageType } from "@/types/packages.types";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Skeleton } from "@/components/ui/skeleton";
import PackageClientPage from "./wellness-page-client";
import Wrapper from "@/components/utility/Wrapper";
import { getAllPublicMedical } from "@/lib/medical/get-medical";
import MedicalClientPage from "./wellness-page-client";
import { routing } from "@/i18n/routing";
import { getAllPublicWellness } from "@/lib/wellness/get-wellness";
import WellnessClientPage from "./wellness-page-client";
import { Metadata, ResolvingMetadata } from "next";

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
      locale === routing.defaultLocale
        ? "Paket Kebugaran"
        : "Our Wellness Packages"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Informasi mengenai berbagai paket kebugaran yang tersedia."
        : "Information about various wellness packages available."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale
          ? "Paket Kebugaran"
          : "Our Wellness Packages"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Informasi mengenai berbagai paket kebugaran yang tersedia."
          : "Information about various wellness packages available."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Paket Kebugaran"
              : "Our Wellness Packages",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Informasi mengenai berbagai paket kebugaran yang tersedia."
              : "Information about various wellness packages available.",
          )}&path=${encodeURIComponent(`m-health.id/wellness/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const WellnessPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const locale = await getLocale();
  return (
    <Wrapper>
      <div className="font-bold text-white mb-20 pt-52 pb-20 -mt-42 text-start bg-primary rounded-b-4xl shadow-[inset_0px_-10px_10px_-2px_rgba(0,0,0,0.1)]">
        <ContainerWrap>
          <h1>
            {locale === routing.defaultLocale
              ? "Paket Kebugaran"
              : "Our Wellness Packages"}
          </h1>
        </ContainerWrap>
      </div>{" "}
      <ContainerWrap>
        <Suspense fallback={<SkeletonComponent per_page={per_page} />}>
          <Content
            params={params}
            page={page}
            per_page={per_page}
            locale={locale}
          />
        </Suspense>
      </ContainerWrap>
    </Wrapper>
  );
};

export default WellnessPage;

const SkeletonComponent = ({ per_page }: { per_page: number }) => {
  return (
    <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 py-10">
      {[...Array(per_page)].map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-full aspect-4/5 rounded-2xl" />
      ))}
    </div>
  );
};

const Content = async ({
  params,
  page,
  per_page,
  locale,
}: {
  params: { [key: string]: string | string[] | undefined };
  page: number;
  per_page: number;
  locale: string;
}) => {
  const { data, total, links, meta } = await getAllPublicWellness(
    page,
    per_page,
  ); // nanti page bisa dynamic

  const wellness = Array.isArray(data) ? data : [];

  const t = await getTranslations("utility");
  return (
    <WellnessClientPage
      wellness={wellness}
      locale={locale}
      labels={{
        days: t("days"),
        night: t("night"),
      }}
      meta={meta}
      links={links}
    />
  );
};
