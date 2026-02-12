"use client";

import Link from "next/link";
import Image from "next/image";

import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import React from "react";
import { calculateDiscount } from "../utility/PriceInfo";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { formatRupiah } from "@/helper/rupiah";
import { routing } from "@/i18n/routing";

const EquipmentCard = ({
  slide,
  locale,
  labels,
}: {
  slide: any;
  locale: string;
  labels: any;
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <div
      key={slide.id}
      className="flex flex-col rounded-2xl w-full group cursor-pointer"
    >
      <Link
        href={`/${locale}/equipment/${slide.slug}`}
        className="flex flex-col w-full h-[calc(100%-20px)] relative rounded-2xl transition-all duration-300"
      >
        <div className="relative">
          <Skeleton
            className={cn(
              "absolute inset-0 z-10 rounded-2xl flex w-full justify-center items-center transition-all duration-500",
              imageLoaded ? "hidden" : "block",
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
              alt={
                locale === routing.defaultLocale
                  ? slide.id_title
                  : slide.en_title
              }
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              className={cn(
                "relative w-full aspect-square object-center object-cover rounded-2xl transition-all duration-500  group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center max-w-full bg-white rounded-2xl -translate-y-5 p-4 h-full transition-all duration-100 z-50">
          <div>
            <div>
              <h5 className="capitalize font-bold text-primary line-clamp-3">
                {locale === routing.defaultLocale
                  ? slide.id_title
                  : slide.en_title}
              </h5>
            </div>
          </div>
          <div className="mt-2 overflow-hidden">
            <div className="inline-flex gap-2 items-center">
              <AvatarVendorHotel
                type="vendor"
                dataIsReady
                initialData={slide.vendor}
                vendor_id={slide.vendor_id}
                locale={locale}
              />
            </div>

            <div className="price mt-5">
              <div className="text-start">
                {slide.discount_price >= 1 && (
                  <div className="inline-flex items-center gap-3">
                    <div className="font-semibold text-red-500 bg-red-50 border-red-500 border px-2 py-1 rounded-full inline-flex w-fit">
                      <p className="inline-flex gap-1 items-center text-xs!">
                        {/* <Percent className="size-5 text-red-500 bg-white rounded-full p-1" /> */}
                        {calculateDiscount(
                          slide.real_price,
                          slide.discount_price,
                        )}
                      </p>
                    </div>
                    <p className="text-muted-foreground">
                      <s>{formatRupiah(slide.real_price)}</s>
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-end mt-2">
                  <h5 className="text-primary font-bold">
                    {formatRupiah(
                      slide.discount_price <= 0
                        ? slide.real_price
                        : slide.discount_price,
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EquipmentCard;
