"use client";

import { PackageType } from "@/types/packages.types";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { SwiperSlide } from "swiper/react";

const PackageCard = ({
  slide,
  locale,
  labels,
  type = "default",
}: {
  slide: PackageType;
  locale: string;
  labels: any;
  type?: "default" | "swiper";
}) => {
  const [loading, setLoading] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return type === "swiper" ? (
    <SwiperSlide
      key={slide.id}
      className="justify-between rounded-2xl max-w-[300px] pb-2 group cursor-pointer flex grow"
      // onMouseEnter={() => setHoveredIndex(key)}
      // onMouseLeave={() => setHoveredIndex(null)}
    >
      <div
        key={slide.id}
        className="flex flex-col rounded-2xl w-full group cursor-pointer"
      >
        <Link
          href={`/${locale}/package/${slide.slug}`}
          className="flex flex-col w-full h-[calc(100%-20px)] relative rounded-2xl transition-all duration-300"
        >
          <div className="relative">
            <p className="absolute bottom-6 left-2 text-muted-foreground bg-white px-4 py-2 rounded-full text-sm! mb-3 z-50 ">
              {slide.duration_by_day} {labels.days} {slide.duration_by_night}{" "}
              {labels.night}
            </p>
            <Skeleton
              className={cn(
                "absolute inset-0 z-10 rounded-2xl flex w-full justify-center items-center transition-all duration-500",
                imageLoaded ? "hidden" : "block"
              )}
            />

            <div className="aspect-square w-full h-auto rounded-2xl overflow-hidden">
              <Image
                src={
                  slide.highlight_image ||
                  "https://placehold.co/720x403.png?text=IMAGE+NOT+FOUND"
                } // Ganti dengan slide.image_url saat tersedia
                width={720}
                height={403}
                alt={locale === "id" ? slide.id_title : slide.en_title}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                className={cn(
                  "relative w-full aspect-square object-center object-cover rounded-2xl transition-all duration-500  group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center grow  max-w-full bg-white rounded-2xl -translate-y-6 p-4 h-full transition-all duration-100 z-50">
            <div className="">
              <div>
                <h5 className="capitalize font-bold text-primary line-clamp-3">
                  {locale === "id" ? slide.id_title : slide.en_title}
                </h5>
              </div>
            </div>
            <div className="mt-2 ">
              <div>
                <p className="text-muted-foreground line-clamp-2">
                  {locale === "id" ? slide.id_tagline : slide.en_tagline}
                </p>
              </div>
            </div>
            <div className="inline-flex gap-2 items-center mt-4">
              <AvatarVendorHotel
                type="vendor"
                vendor_id={slide.vendor_id}
                locale={locale}
              />
            </div>
          </div>
        </Link>
      </div>
    </SwiperSlide>
  ) : (
    <div
      key={slide.id}
      className="flex flex-col rounded-2xl w-full group cursor-pointer"
    >
      <Link
        href={`/${locale}/package/${slide.slug}`}
        className="flex flex-col w-full h-[calc(100%-20px)] relative rounded-2xl transition-all duration-300"
      >
        <div className="relative">
          <p className="absolute bottom-6 left-2 text-muted-foreground bg-white px-4 py-2 rounded-full text-sm! mb-3 z-50 ">
            {slide.duration_by_day} {labels.days} {slide.duration_by_night}{" "}
            {labels.night}
          </p>
          <Skeleton
            className={cn(
              "absolute inset-0 z-10 rounded-2xl flex w-full justify-center items-center transition-all duration-500",
              imageLoaded ? "hidden" : "block"
            )}
          />

          <div className="aspect-square w-full h-auto rounded-2xl overflow-hidden">
            <Image
              src={
                slide.highlight_image ||
                "https://placehold.co/720x403.png?text=IMAGE+NOT+FOUND"
              } // Ganti dengan slide.image_url saat tersedia
              width={720}
              height={403}
              alt={locale === "id" ? slide.id_title : slide.en_title}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              className={cn(
                "relative w-full aspect-square object-center object-cover rounded-2xl transition-all duration-500  group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center grow  max-w-full bg-white rounded-2xl -translate-y-6 p-4 h-full transition-all duration-100 z-50">
          <div className="">
            <div>
              <h5 className="capitalize font-bold text-primary line-clamp-3">
                {locale === "id" ? slide.id_title : slide.en_title}
              </h5>
            </div>
          </div>
          <div className="mt-2 ">
            <div>
              <p className="text-muted-foreground line-clamp-2">
                {locale === "id" ? slide.id_tagline : slide.en_tagline}
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 items-center mt-4">
            <AvatarVendorHotel
              type="vendor"
              vendor_id={slide.vendor_id}
              locale={locale}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PackageCard;
