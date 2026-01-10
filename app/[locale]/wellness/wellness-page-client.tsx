"use client";

import SimplePagination from "@/components/utility/simple-pagination";
import { PackageType } from "@/types/packages.types";
import Link from "next/link";
import Image from "next/image";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import React from "react";
import { MedicalType } from "@/types/medical.types";
import { WellnessType } from "@/types/wellness.types";
import { AnimatePresence, motion } from "framer-motion";
import { routing } from "@/i18n/routing";
import WellnessCard from "@/components/wellness/wellness-card";

const WellnessClientPage = ({
  wellness,
  locale,
  labels,
  meta,
  links,
}: {
  wellness: WellnessType[];
  locale: string;
  labels: any;
  meta: any;
  links: any;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  return (
    <div className="mb-[10vh]">
      <div className="lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 grid">
        {wellness.map((d, i) => (
          <WellnessCard key={d.id} d={d} locale={locale} i={i} />
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

export default WellnessClientPage;
