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
import EventCard from "@/components/events/event-card";
import SearchArea from "@/components/utility/SearchArea";
import FailedGetDataNotice from "@/components/utility/FailedGetDataNotice";

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

  if (!Array.isArray(event) || event.length <= 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center w-full">
        <FailedGetDataNotice />
      </div>
    );
  }
  return (
    <div className="mb-[10vh]">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        {event.map((e, i) => (
          <EventCard key={e.id} e={e} locale={locale} />
        ))}
      </div>
      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
      <SearchArea target="events" />
    </div>
  );
};

export default EventPageClient;
