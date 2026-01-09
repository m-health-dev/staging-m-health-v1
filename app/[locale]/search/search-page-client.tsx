"use client";

import { EventsType } from "@/types/events.types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Package,
  PencilLine,
} from "lucide-react";
import React from "react";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { Button } from "@/components/ui/button";
import SimplePagination from "@/components/utility/simple-pagination";
import { VendorType } from "@/types/vendor.types";
import { Vendor } from "ua-parser-js/enums";
import VendorCard from "@/components/vendor-hotel/vendor-card";
import { PackageType } from "@/types/packages.types";
import PackageCard from "@/components/package/package-card";
import { MedicalType } from "@/types/medical.types";
import { WellnessType } from "@/types/wellness.types";
import { HotelType } from "@/types/hotel.types";
import WellnessCard from "@/components/wellness/wellness-card";

// "articles",
// "events",
// "hotels",
// "medical",
// "medical-equipment",
// "packages",
// "vendors",
// "wellness"

const SearchPageClient = ({
  results,
  locale,
  labels,
  summary,
}: {
  results: any;
  locale: string;
  labels: any;
  summary: any[];
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const vendorResults: VendorType[] = results?.vendors;
  const packageResults: PackageType[] = results?.packages;
  const hotelResults: HotelType[] = results?.hotels;
  const medicalResults: MedicalType[] = results?.medical;
  const wellnessResults: WellnessType[] = results?.wellness;

  const router = useRouter();
  return (
    <div className="mb-[10vh] space-y-10">
      {packageResults && packageResults.length > 0 && (
        <div>
          <h4 className="text-primary font-bold mb-10">
            {locale === routing.defaultLocale
              ? "Paket Kebugaran & Medis"
              : "Wellness & Medical Packages"}
          </h4>

          <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
            {packageResults.map((n, index) => {
              return (
                <PackageCard
                  key={n.id}
                  slide={n}
                  locale={locale}
                  labels={labels}
                />
              );
            })}
          </div>
        </div>
      )}
      {wellnessResults && wellnessResults.length > 0 && (
        <div>
          <h4 className="text-primary font-bold mb-10">
            {locale === routing.defaultLocale
              ? "Paket Kebugaran"
              : "Wellness Packages"}
          </h4>

          <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
            {wellnessResults.map((n, index) => {
              return (
                <WellnessCard key={n.id} d={n} locale={locale} i={index} />
              );
            })}
          </div>
        </div>
      )}
      {vendorResults && vendorResults.length > 0 && (
        <div>
          <h4 className="text-primary font-bold mb-10">
            {locale === routing.defaultLocale
              ? "Mitra Kolaborasi & Rumah Sakit"
              : "Partners & Hospitals Collaboration"}
          </h4>

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
            {vendorResults.map((n, index) => {
              return (
                <Link
                  key={n.id}
                  href={`/${locale}/vendor/${n.slug}`}
                  className="no-underline"
                >
                  <VendorCard v={n} locale={locale} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPageClient;
