"use client";

import {
  ArrowUpRight,
  Calendar,
  Map,
  MapPin,
  PencilLine,
  Pin,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import Link from "next/link";
import { Button } from "../ui/button";
import { EventsType } from "@/types/events.types";
import { routing } from "@/i18n/routing";
import { useRouter } from "next/navigation";

const CurrentEventsGrid = ({
  data,
  locale,
}: {
  data: EventsType[];
  locale: string;
}) => {
  const router = useRouter();

  console.log("Current Events Grid data:", data.length);
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
      {data.map((e, i) => (
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
                <div className="events_location flex gap-2 items-center">
                  <Calendar className="size-4" />
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
                      <LocalDateTime date={e.end_date} specificFormat="HH:mm" />
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      <LocalDateTime
                        date={e.start_date}
                        specificFormat="DD MMM YYYY - HH:mm"
                      />{" "}
                      {locale === routing.defaultLocale ? "sampai" : "to"}{" "}
                      <LocalDateTime
                        date={e.end_date}
                        specificFormat="DD MMM YYYY - HH:mm"
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
                    <p>Register to this Event</p>
                  </Button>
                </Link>
              ) : (
                <p className="bg-gray-100 inline-flex py-2 px-4 rounded-full lg:w-fit w-full text-muted-foreground font-medium items-center gap-3 justify-center">
                  <PencilLine className="size-4" /> On Site Registration
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurrentEventsGrid;
