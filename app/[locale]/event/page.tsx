import React, { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import EventPageClient from "./event-page-client";
import { getAllEvents } from "@/lib/events/get-events";
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
      locale === routing.defaultLocale ? "Acara" : "Our Events"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Deskripsi acara dan informasi terkait lainnya."
        : "Event descriptions and other related information."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Acara" : "Our Events"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Deskripsi acara dan informasi terkait lainnya."
          : "Event descriptions and other related information."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Acara" : "Our Events",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Deskripsi acara dan informasi terkait lainnya."
              : "Event descriptions and other related information.",
          )}&path=${encodeURIComponent("m-health.id/event")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const EventsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const locale = await getLocale();
  return (
    <Wrapper>
      <div className="font-bold text-white mb-20 pt-52 pb-20 -mt-42 text-start bg-primary rounded-b-4xl shadow-[inset_0px_-10px_10px_-2px_rgba(0,0,0,0.1)]">
        <ContainerWrap>
          <h1>{locale === routing.defaultLocale ? "Acara" : "Our Events"}</h1>
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

export default EventsPage;

const SkeletonComponent = ({ per_page }: { per_page: number }) => {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-4 pb-20">
      {[...Array(per_page)].map((_, i) => (
        <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
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
  const { data, total, links, meta } = await getAllEvents(page, per_page); // nanti page bisa dynamic

  const events = Array.isArray(data) ? data : [];

  const t = await getTranslations("utility");
  return (
    <EventPageClient
      event={events}
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
