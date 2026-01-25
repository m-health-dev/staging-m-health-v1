import { getLocale, getTranslations } from "next-intl/server";
import React, { Suspense } from "react";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import QuickAction from "@/components/home/QuickAction";
import SearchPageClient from "./search-page-client";
import { routing } from "@/i18n/routing";
import { getAllSearchResultPublished } from "@/lib/search/get-search";
import { connection } from "next/server";
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
      locale === routing.defaultLocale ? "Pencarian" : "Search"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
        : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Pencarian" : "Search"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
          : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Pencarian" : "Search",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai `digital front door` — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau."
              : "M HEALTH is a digital health platform designed to help you access fast, accurate, and reliable medical information. We understand that finding the right health solutions can often feel overwhelming. That’s why we act as a `digital front door` — making it easier for anyone to ask questions, consult with professionals, and plan their medical and wellness journey in a simple, transparent, and affordable way.",
          )}&path=${encodeURIComponent("m-health.id/search")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const SearchPage = async ({ searchParams }: Props) => {
  await connection();

  const params = await searchParams;
  const query = (params.q as string) || "";
  const target = params.target as string | "";

  const locale = await getLocale();

  return (
    <Wrapper>
      <div className="mb-20 pt-40 pb-20 -mt-28 text-center bg-primary rounded-b-4xl shadow-[inset_0px_-10px_10px_-2px_rgba(0,0,0,0.1)]">
        <ContainerWrap>
          <h1 className="font-bold text-white">
            {locale === routing.defaultLocale ? "Pencarian" : "Search"}
          </h1>
          <p className="text-white mt-2">
            {locale === routing.defaultLocale ? "Hasil untuk" : "Results for"} "
            {query}"
          </p>

          <div className="flex w-full justify-center">
            <div className="mt-5 w-full">
              <QuickAction
                includeSearchBar
                withoutQuickLinks
                query={query}
                target={target}
                className="max-w-2xl"
              />
            </div>
          </div>
        </ContainerWrap>
      </div>

      <ContainerWrap>
        <Suspense fallback={<SkeletonComponent total={10} />}>
          <Content
            params={params}
            query={query}
            locale={locale}
            target={target}
          />
        </Suspense>
      </ContainerWrap>
    </Wrapper>
  );
};

export default SearchPage;

const SkeletonComponent = ({ total }: { total: number }) => {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-4 pb-20">
      {Array.from({ length: total }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
};

const Content = async ({
  query,
  locale,
  target,
}: {
  params: Record<string, string | string[] | undefined>;
  query: string;
  locale: string;
  target?: string;
}) => {
  // 1. Panggil fungsi
  const searchResponse = target
    ? await getAllSearchResultPublished(query, target)
    : await getAllSearchResultPublished(query);

  // 2. Gunakan destructuring dengan nilai fallback (default value)
  const {
    summary = { by_type: [] },
    results = [],
    total = 0,
  } = searchResponse || {};

  // 3. Sekarang ini jauh lebih aman
  const summaryData = Array.isArray(summary?.by_type) ? summary.by_type : [];
  const t = await getTranslations("utility");

  return (
    <>
      {total === 0 ? (
        <div className="bg-white rounded-2xl p-4 mb-20">
          <h5 className="text-primary font-bold">
            {locale === routing.defaultLocale
              ? "Tidak ada data ditemukan"
              : "No data found"}
          </h5>
          <p className="text-muted-foreground mt-2">
            {locale === routing.defaultLocale
              ? "Coba gunakan kata kunci lain untuk pencarian Anda."
              : "Try using different keywords for your search."}
          </p>
        </div>
      ) : (
        <>
          <p className="bg-white border inline-flex px-4 py-2 rounded-full mb-10">
            {locale === routing.defaultLocale
              ? `${total} Data ditemukan`
              : `Found ${total} Data`}
          </p>

          <SearchPageClient
            results={results}
            summary={summaryData}
            locale={locale}
            labels={{
              days: t("days"),
              night: t("night"),
            }}
          />
        </>
      )}
    </>
  );
};
