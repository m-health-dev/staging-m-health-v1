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
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import EventPageClient from "./search-page-client";
import { getAllEvents } from "@/lib/events/get-events";
import { getAllSearchResultPublished } from "@/lib/search/get-search";
import SearchPageClient from "./search-page-client";
import QuickAction from "@/components/home/QuickAction";
import { connection } from "next/server";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await connection();

  const params = await searchParams;
  const query = params.q;

  const locale = await getLocale();

  return (
    <Wrapper>
      <div className=" mb-20 pt-40 pb-20 -mt-28 text-center bg-primary rounded-b-4xl shadow-[inset_0px_-10px_10px_-2px_rgba(0,0,0,0.1)]">
        <ContainerWrap>
          <h1 className="font-bold text-white">
            {locale === routing.defaultLocale ? "Pencarian" : "Search"}
          </h1>
          <p className="text-white mt-2">
            {locale === routing.defaultLocale ? "Hasil untuk" : "Results for"} "
            {query as string}"
          </p>
          <div className="mt-5">
            <QuickAction
              includeSearchBar
              withoutQuickLinks
              query={query as string}
            />
          </div>
        </ContainerWrap>
      </div>{" "}
      <ContainerWrap>
        <Suspense fallback={<SkeletonComponent total={10} />}>
          <Content params={params} query={query as string} locale={locale} />
        </Suspense>
      </ContainerWrap>
    </Wrapper>
  );
};

export default SearchPage;

const SkeletonComponent = ({ total }: { total: number }) => {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-4 pb-20">
      {[...Array(total)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
};

const Content = async ({
  params,
  query,
  locale,
}: {
  params: { [key: string]: string | string[] | undefined };
  query: string;
  locale: string;
}) => {
  const { summary, results, total, meta } = await getAllSearchResultPublished(
    query
  );

  const summaryData = Array.isArray(summary.by_type) ? summary.by_type : [];

  const t = await getTranslations("utility");

  return (
    <>
      {total === 0 ? (
        <div className="bg-white border rounded-2xl p-4 mb-20">
          <h5 className="text-primary font-bold">
            {locale === routing.defaultLocale
              ? "Tidak ada data ditemukan"
              : "No data found"}
          </h5>
          <p>
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
              : `Found ${total} Data `}{" "}
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
