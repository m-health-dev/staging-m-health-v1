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
import EventPageClient from "./article-page-client";
import { getAllEvents } from "@/lib/events/get-events";
import { getAllPublicArticles } from "@/lib/articles/get-articles";
import ArticlePageClient from "./article-page-client";
import { Metadata, ResolvingMetadata } from "next";

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
      locale === routing.defaultLocale ? "Artikel" : "Articles"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Artikel dan informasi terbaru tentang kamu dan M HEALTH"
        : "Articles and information about you and M HEALTH"
    }`,
  };
}

const ArticlePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const locale = await getLocale();
  return (
    <Wrapper>
      <div className="font-bold text-white mb-20 pt-40 pb-20 -mt-28 text-center bg-primary rounded-b-4xl shadow-[inset_0px_-10px_10px_-2px_rgba(0,0,0,0.1)]">
        <ContainerWrap>
          <h1>
            {locale === routing.defaultLocale ? "Artikel" : "Our Articles"}
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

export default ArticlePage;

const SkeletonComponent = ({ per_page }: { per_page: number }) => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 pb-20">
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
  const { data, total, links, meta } = await getAllPublicArticles(
    page,
    per_page
  ); // nanti page bisa dynamic

  const articles = Array.isArray(data) ? data : [];

  const t = await getTranslations("utility");
  return (
    <ArticlePageClient
      articles={articles}
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
