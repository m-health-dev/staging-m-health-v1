"use client";

import { EventsType } from "@/types/events.types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ArrowUpRight, Calendar, MapPin, PencilLine } from "lucide-react";
import React from "react";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { Button } from "@/components/ui/button";
import SimplePagination from "@/components/utility/simple-pagination";

const EventPageClient = ({
  event,
  locale,
  labels,
  meta,
  links,
}: {
  event: EventsType[];
  locale: string;
  labels: any;
  meta: any;
  links: any;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const router = useRouter();
  return (
    <div className="mb-[10vh]">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        {event.map((e, i) => (
          <div
            className="grid md:grid-cols-3 grid-cols-1 items-center bg-white border rounded-2xl group hover:outline-2 hover:outline-primary transition-all duration-100 cursor-pointer"
            key={e.id}
          >
            <div className="col-span-1 relative aspect-square">
              <Link href={`/${locale}/event/${e.slug}`}>
                <Image
                  src={e.highlight_image}
                  alt={e.en_title}
                  width={500}
                  height={500}
                  className="w-full h-full aspect-square object-cover rounded-2xl"
                />
                <div className="inline-flex items-center gap-2 p-2 absolute bottom-0 left-0 z-20 bg-white rounded-bl-2xl rounded-tr-2xl">
                  <Image
                    src={e.organized_image}
                    width={100}
                    height={100}
                    alt={e.organized_by}
                    className="aspect-square w-5 h-5 rounded-full"
                  />
                  <p className="text-xs! text-muted-foreground">
                    {e.organized_by}
                  </p>
                </div>
              </Link>
            </div>
            <div className="col-span-2 p-4">
              <div onClick={() => router.push(`/${locale}/event/${e.slug}`)}>
                <h5 className="capitalize font-bold text-primary line-clamp-2">
                  {locale === routing.defaultLocale ? e.id_title : e.en_title}
                </h5>

                <div className="mt-2 mb-3">
                  <div className="events_location flex gap-2 items-center">
                    <MapPin className="size-4" />
                    <Link href={e.location_map}>
                      <p className="text-muted-foreground">{e.location_name}</p>
                    </Link>
                  </div>
                  <div className="events_location flex gap-2 items-start">
                    <Calendar className="size-4 mt-1" />
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
                          specificFormat={`HH:mm ${
                            locale === routing.defaultLocale ? "WIB" : "UTC"
                          }`}
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
              </div>

              <div className="flex items-center gap-3">
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
                      ? "Pendaftaran Di Tempat"
                      : "On Site Registration"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
    </div>
  );
};

export default EventPageClient;
