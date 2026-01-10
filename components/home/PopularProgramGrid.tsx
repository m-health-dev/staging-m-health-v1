"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "boring-avatars";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { WellnessType } from "@/types/wellness.types";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import Link from "next/link";
import ContainerWrap from "../utility/ContainerWrap";
import WellnessCard from "../wellness/wellness-card";

const PopularProgramGrid = ({
  data,
  locale,
}: {
  data: WellnessType[];
  locale: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  console.log("Popular Program Grid data:", data.length);
  if (!Array.isArray(data) || data.length <= 0) {
    return <FailedGetDataNotice />;
  }

  const onlyGet8: WellnessType[] = data.slice(0, 8);
  const onlyGet4: WellnessType[] = data.slice(0, 4);
  return (
    <>
      <div className="lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-5 lg:grid hidden">
        {onlyGet8.map((d, i) => (
          <WellnessCard key={d.id} d={d} locale={locale} i={i} />
        ))}
      </div>
      <div className="flex-col gap-5 lg:hidden flex">
        {onlyGet4.map((d, i) => (
          <WellnessCard key={d.id} d={d} locale={locale} i={i} />
        ))}
      </div>
    </>
  );
};

export default PopularProgramGrid;
