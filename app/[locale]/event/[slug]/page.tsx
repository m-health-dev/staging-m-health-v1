import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { getEventBySlug } from "@/lib/events/get-events";
import { EventsType } from "@/types/events.types";
import React from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ArrowUpRight, Calendar, MapPin, PencilLine } from "lucide-react";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { Button } from "@/components/ui/button";
import CarouselEvent from "./CarouselEvent";
import type { Metadata, ResolvingMetadata } from "next";
import { stripHtml } from "@/helper/removeHTMLTag";
import NotFoundContent from "@/components/utility/NotFoundContent";

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

  // const { data } = await getEventBySlug(slug);
  // const e: EventsType = data.data;

  let e: EventsType | null = null;

  try {
    const res = await getEventBySlug(slug);
    e = res?.data?.data ?? null;
  } catch (error) {
    console.error("Event fetch error:", error);
  }

  if (!e) {
    return {};
  }

  const rawContent =
    locale === routing.defaultLocale ? e.id_description : e.en_description;

  const plainDescription = stripHtml(rawContent);

  return {
    title: `${
      locale === routing.defaultLocale ? e.id_title : e.en_title
    } - M HEALTH`,
    description: `${plainDescription}`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? e.id_title : e.en_title
      } - M HEALTH`,
      description: `${plainDescription}`,
      images: [
        {
          url:
            e.highlight_image ||
            `/api/og?title=${encodeURIComponent(
              locale === routing.defaultLocale ? e.id_title : e.en_title,
            )}&description=${encodeURIComponent(
              plainDescription,
            )}&path=${encodeURIComponent(`m-health.id/event/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const EventsContent = async ({ params }: Props) => {
  const { slug } = await params;
  const locale = await getLocale();

  // const { data } = await getEventBySlug(slug);
  // const e: EventsType = data.data;

  let e: EventsType | null = null;

  try {
    const res = await getEventBySlug(slug);
    e = res?.data?.data ?? null;
  } catch (error) {
    console.error("Event fetch error:", error);
  }

  if (!e) {
    return <NotFoundContent messageNoData />;
  }

  const carousel = [e.highlight_image, ...e.reference_image];
  return (
    <Wrapper>
      <ContainerWrap className="mt-10">
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 items-center">
          <div className="lg:col-span-1">
            <CarouselEvent e={e} />
          </div>
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              <h2 className="text-primary font-semibold">
                {locale === routing.defaultLocale ? e.id_title : e.en_title}
              </h2>

              <div className="mt-2 mb-3">
                <div className="events_location flex gap-2 items-center mb-3">
                  <div className="bg-white w-8 h-8 flex shrink-0 justify-center items-center border border-primary rounded-full">
                    <MapPin className="size-4 text-primary" />
                  </div>

                  <Link href={e.location_map}>
                    <p className="text-muted-foreground">{e.location_name}</p>
                  </Link>
                </div>
                <div className="events_location flex gap-2 items-center">
                  <div className="bg-white w-8 h-8 flex shrink-0 justify-center items-center border border-primary rounded-full">
                    <Calendar className="size-4 text-primary" />
                  </div>
                  {new Date(e.start_date).toLocaleDateString("id-ID") ===
                  new Date(e.end_date).toLocaleDateString("id-ID") ? (
                    <p className="text-muted-foreground">
                      <LocalDateTime
                        date={e.start_date}
                        specificFormat="DD MMM YYYY"
                      />
                      ,{" "}
                      <LocalDateTime
                        date={e.start_date}
                        specificFormat="HH:mm"
                      />{" "}
                      -{" "}
                      <LocalDateTime
                        date={e.end_date}
                        specificFormat={`HH:mm ${
                          locale === routing.defaultLocale ? "WIB" : "UTC"
                        }`}
                      />
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      <LocalDateTime
                        date={e.start_date}
                        specificFormat={`DD MMM YYYY - HH:mm ${
                          locale === routing.defaultLocale ? "WIB" : "UTC"
                        }`}
                      />{" "}
                      {locale === routing.defaultLocale ? "sampai" : "to"}{" "}
                      <LocalDateTime
                        date={e.end_date}
                        specificFormat={`DD MMM YYYY - HH:mm ${
                          locale === routing.defaultLocale ? "WIB" : "UTC"
                        }`}
                      />
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm! text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Diselenggarakan oleh"
                    : "Organized by"}
                </p>
                <div className="inline-flex items-center gap-2">
                  <Image
                    src={e.organized_image}
                    width={250}
                    height={250}
                    alt={e.organized_by}
                    className="aspect-square w-10 h-10 rounded-full border"
                  />
                  <p className="text-muted-foreground">{e.organized_by}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerWrap>
      <ContainerWrap className="mb-[10vh]">
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 items-start mt-10">
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl border">
            <p className="text-sm! text-muted-foreground mb-2">
              {locale === routing.defaultLocale
                ? "Tentang Acara"
                : "About the Event"}
            </p>
            <div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    locale === routing.defaultLocale
                      ? e.id_description
                      : e.en_description,
                }}
              />
            </div>
          </div>
          <div className="lg:order-last order-first">
            <div className="bg-white border rounded-2xl p-4 ">
              <p className="text-primary font-semibold">
                {locale === routing.defaultLocale
                  ? "Informasi Registrasi"
                  : "Registration Information"}
              </p>
              <div className="mt-2">
                {e.registration_url ? (
                  <Link href={e.registration_url} target="_blank">
                    <Button className="rounded-full lg:w-fit w-full font-medium cursor-pointer">
                      <ArrowUpRight className="size-5" />{" "}
                      <p>
                        {locale === routing.defaultLocale
                          ? "Daftar ke Acara Ini"
                          : "Register to this Event"}
                      </p>
                    </Button>
                  </Link>
                ) : (
                  <p className="bg-gray-100 inline-flex py-2 px-4 rounded-full lg:w-fit w-full text-muted-foreground font-medium items-center gap-3 justify-center">
                    <PencilLine className="size-4" />{" "}
                    {locale === routing.defaultLocale
                      ? "Pendaftaran di Lokasi"
                      : "On Site Registration"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default EventsContent;
