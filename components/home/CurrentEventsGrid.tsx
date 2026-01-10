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
import ContainerWrap from "../utility/ContainerWrap";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import EventCard from "../events/event-card";

const CurrentEventsGrid = ({
  data,
  locale,
}: {
  data: EventsType[];
  locale: string;
}) => {
  const router = useRouter();

  if (!Array.isArray(data) || data.length <= 0) {
    return <FailedGetDataNotice />;
  }

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
      {data.map((e, i) => (
        <EventCard key={e.id} e={e} locale={locale} />
      ))}
    </div>
  );
};

export default CurrentEventsGrid;
