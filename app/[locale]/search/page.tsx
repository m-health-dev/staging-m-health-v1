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

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  await connection();

  const params = await searchParams;
  const query = (params.q as string) || "";
  const target = params.target as string | undefined;

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

          <div className="mt-5">
            <QuickAction
              includeSearchBar
              withoutQuickLinks
              query={query}
              target={target}
            />
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
  let summary, results, total, meta;

  if (target) {
    ({ summary, results, total, meta } = await getAllSearchResultPublished(
      query,
      target
    ));
  } else {
    ({ summary, results, total, meta } = await getAllSearchResultPublished(
      query
    ));
  }

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
