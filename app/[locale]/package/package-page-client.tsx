"use client";

import SimplePagination from "@/components/utility/simple-pagination";
import { PackageType } from "@/types/packages.types";
import Link from "next/link";
import Image from "next/image";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import React from "react";
import PackageCard from "@/components/package/package-card";

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
    </div>
  );
};

export default PackageClientPage;
