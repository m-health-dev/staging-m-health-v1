import React, { Suspense } from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { get10ImageEvents } from "@/lib/unsplashImage";
import CurrentEventsGrid from "./CurrentEventsGrid";
import { getAllEvents } from "@/lib/events/get-events";
import { Skeleton } from "../ui/skeleton";
import { getLocale, getTranslations } from "next-intl/server";
import PopularMedSlide from "./PopularMedSlide";
import { locale } from "dayjs";
import { routing } from "@/i18n/routing";

const CurrentEvents = async () => {
  const { data } = await getAllEvents(1, 4);
  const locale = await getLocale();
  return (
    <div className="bg-background pt-[5vh] -mt-[25vh] lg:rounded-t-[5rem] pb-[5vh] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-primary mt-8 mb-20">
          {locale === routing.defaultLocale
            ? "Acara Terbaru"
            : "Current Events"}
        </h1>
        <Suspense fallback={<SkeletonComponent />}>
          <Content />
        </Suspense>
      </ContainerWrap>
    </div>
  );
};

export default CurrentEvents;

const SkeletonComponent = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
      ))}
    </div>
  );
};

const Content = async () => {
  const [eventsResult, locale] = await Promise.all([
    await getAllEvents(1, 10),
    getLocale(),
  ]);

  const t = await getTranslations("utility");

  const events = Array.isArray(eventsResult.data) ? eventsResult.data : [];
  return <CurrentEventsGrid data={events} locale={locale} />;
};
