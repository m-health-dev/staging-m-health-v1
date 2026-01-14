import React, { Suspense } from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { get10ImageEvents, get5ImageNews } from "@/lib/unsplashImage";
import CurrentEventsGrid from "./CurrentEventsGrid";
import OurNewsGrid from "./OurNewsGrid";
import {
  getAllArticles,
  getAllPublicArticles,
} from "@/lib/articles/get-articles";
import { getLocale, getTranslations } from "next-intl/server";
import { Skeleton } from "../ui/skeleton";
import { routing } from "@/i18n/routing";

const OurNews = async () => {
  const locale = await getLocale();
  return (
    <div className="mt-[5vh] bg-white border-t lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap className="py-[5vh]">
        <h2 className="font-bold text-primary mt-5 mb-16 text-center">
          {locale === routing.defaultLocale ? "Artikel Terbaru" : "Our News"}
        </h2>
        <Suspense fallback={<SkeletonComponent />}>
          <Content />
        </Suspense>
      </ContainerWrap>
      <div className="bg-linear-to-b from-white to-background w-full h-52" />
    </div>
  );
};

export default OurNews;

const SkeletonComponent = () => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
      ))}
    </div>
  );
};

const Content = async () => {
  const locale = await getLocale();

  const { data: articlesResult } = await getAllPublicArticles(1, 4);

  const articles = Array.isArray(articlesResult) ? articlesResult : [];

  const t = await getTranslations("utility");
  return (
    <OurNewsGrid
      data={articles}
      locale={locale}
      labels={{
        days: t("days"),
        night: t("night"),
      }}
    />
  );
};
