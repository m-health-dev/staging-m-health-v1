"use client";

import SimplePagination from "@/components/utility/simple-pagination";
import { PackageType } from "@/types/packages.types";
import Link from "next/link";
import Image from "next/image";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import React from "react";
import { MedicalType } from "@/types/medical.types";
import MedicalCard from "@/components/medical/medical-card";
import SearchArea from "@/components/utility/SearchArea";
import FailedGetDataNotice from "@/components/utility/FailedGetDataNotice";

const MedicalClientPage = ({
  medicals,
  locale,
  labels,
  meta,
  links,
}: {
  medicals: MedicalType[];
  locale: string;
  labels: any;
  meta: any;
  links: any;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  if (!Array.isArray(medicals) || medicals.length <= 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center w-full">
        <FailedGetDataNotice />
      </div>
    );
  }
  return (
    <div className="mb-[10vh]">
      <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 lg:pb-0 px-2">
        {medicals.map((slide, key) => (
          <MedicalCard
            key={slide.id}
            slide={slide}
            locale={locale}
            labels={labels}
            type="default"
          />
        ))}
      </div>
      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
      <SearchArea target="medical" />
    </div>
  );
};

export default MedicalClientPage;
