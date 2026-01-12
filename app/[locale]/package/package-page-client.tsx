"use client";

import SimplePagination from "@/components/utility/simple-pagination";
import { PackageType } from "@/types/packages.types";
import Link from "next/link";
import Image from "next/image";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import React from "react";
import PackageCard from "@/components/package/package-card";
import SearchArea from "@/components/utility/SearchArea";
import FailedGetDataNotice from "@/components/utility/FailedGetDataNotice";

const PackageClientPage = ({
  packages,
  locale,
  labels,
  meta,
  links,
}: {
  packages: PackageType[];
  locale: string;
  labels: any;
  meta: any;
  links: any;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (!Array.isArray(packages) || packages.length <= 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center w-full">
        <FailedGetDataNotice />
      </div>
    );
  }
  return (
    <div className="mb-[10vh]">
      <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 lg:pb-0 px-2">
        {packages.map((slide, key) => (
          <PackageCard
            key={key}
            slide={slide}
            locale={locale}
            labels={labels}
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
      <SearchArea target="packages" />
    </div>
  );
};

export default PackageClientPage;
