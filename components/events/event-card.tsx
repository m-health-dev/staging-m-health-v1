import { EventsType } from "@/types/events.types";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ArrowUpRight, Calendar, MapPin, PencilLine } from "lucide-react";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const EventCard = ({ e, locale }: { e: EventsType; locale: string }) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <div
      className="grid md:grid-cols-3 grid-cols-1 items-center bg-white border rounded-2xl group hover:outline-2 hover:outline-primary transition-all duration-100 cursor-pointer"
      key={e.id}
    >
      <div className="col-span-1 relative aspect-square">
        <Link href={`/${locale}/event/${e.slug}`}>
          <div className="aspect-square w-full h-auto rounded-2xl overflow-hidden">
            <Skeleton
              className={cn(
                "absolute inset-0 z-10 rounded-2xl flex w-full justify-center items-center transition-all duration-500",
                imageLoaded ? "hidden" : "block",
              )}
            />
            <Image
              src={
                e.highlight_image ||
                "https://placehold.co/720x403.png?text=IMAGE+NOT+FOUND"
              } // Ganti dengan slide.image_url saat tersedia
              width={720}
              height={403}
              alt={locale === routing.defaultLocale ? e.id_title : e.en_title}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              className={cn(
                "relative w-full aspect-square object-center object-cover rounded-2xl transition-all duration-500  group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
          <div className="inline-flex items-center gap-2 p-2 absolute bottom-3 left-2 z-20 bg-white rounded-2xl">
            <Image
              src={e.organized_image}
              width={100}
              height={100}
              alt={e.organized_by}
              className="aspect-square w-5 h-5 rounded-full"
            />
            <p className="text-xs! text-muted-foreground">{e.organized_by}</p>
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

        <div className="flex items-center gap-3 w-full">
          {e.registration_url ? (
            <Link
              href={`${e.registration_url}`}
              target="_blank"
              className="flex w-full"
            >
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
  );
};

export default EventCard;
