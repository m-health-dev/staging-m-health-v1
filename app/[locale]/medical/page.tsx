import React, { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/utility/Wrapper";
import { getAllPublicMedical } from "@/lib/medical/get-medical";
import MedicalClientPage from "./medical-page-client";
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";

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
      locale === routing.defaultLocale ? "Paket Medis" : "Our Medical Packages"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Informasi mengenai berbagai paket medis yang tersedia."
        : "Information about various medical packages available."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale
          ? "Paket Medis"
          : "Our Medical Packages"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Informasi mengenai berbagai paket medis yang tersedia."
          : "Information about various medical packages available."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Paket Medis"
              : "Our Medical Packages",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Informasi mengenai berbagai paket medis yang tersedia."
              : "Information about various medical packages available.",
          )}&path=${encodeURIComponent(`m-health.id/medical`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const MedicalPage = async ({ searchParams }: Props) => {
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
              ? "Paket Medis"
              : "Our Medical Packages"}
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

export default MedicalPage;

const SkeletonComponent = ({ per_page }: { per_page: number }) => {
  return (
    <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 pb-20">
      {[...Array(per_page)].map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
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
  const { data, total, links, meta } = await getAllPublicMedical(
    page,
    per_page,
  ); // nanti page bisa dynamic

  const medicals = Array.isArray(data) ? data : [];

  const t = await getTranslations("utility");
  return (
    <MedicalClientPage
      medicals={medicals}
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
