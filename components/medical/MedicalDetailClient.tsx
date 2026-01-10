"use client";

import React, { useRef, useState } from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import {
  Cookie,
  Mars,
  Minus,
  Moon,
  Percent,
  Plane,
  Plus,
  Sun,
  Ticket,
  TicketPercent,
  Utensils,
  Venus,
  VenusAndMars,
} from "lucide-react";
import Avatar from "boring-avatars";
import { Input } from "../ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { PackageType } from "@/types/packages.types";
import { routing } from "@/i18n/routing";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PriceInfo from "../utility/PriceInfo";
import { MedicalType } from "@/types/medical.types";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const MedicalDetailClient = ({
  medical: p,
  locale,
  labels,
}: {
  medical: MedicalType;
  locale: string;
  labels: any;
}) => {
  const swiperRef = useRef<any>(null);
  const sliderImage = [p.highlight_image, ...p.reference_image];

  // const t = useTranslations("utility");

  const payID = uuidv4();

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <ContainerWrap className="grid lg:grid-cols-8 grid-cols-1 gap-5 my-20">
      <div className="lg:col-span-2">
        <div className="w-full flex flex-col items-center relative group/slide">
          {/* Swiper Container */}
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={true}
            grabCursor={true}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full rounded-2xl"
          >
            {sliderImage.map((img, key) => (
              <SwiperSlide key={key} className="border relative">
                <Skeleton
                  className={cn(
                    "absolute inset-0 z-10 rounded-2xl flex w-full justify-center items-center transition-all duration-500",
                    imageLoaded ? "hidden" : "block"
                  )}
                />

                <div className="aspect-square w-full h-auto rounded-2xl overflow-hidden">
                  <Image
                    src={
                      img ||
                      "https://placehold.co/720x403.png?text=IMAGE+NOT+FOUND"
                    } // Ganti dengan slide.image_url saat tersedia
                    width={720}
                    height={403}
                    alt={img}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                    className={cn(
                      "relative w-full aspect-square object-center object-cover rounded-2xl transition-all duration-500  group-hover:scale-105",
                      imageLoaded ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="lg:px-5 px-3 absolute top-0 left-0 z-20 flex h-full items-center transition-all duration-300 translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperRef.current) {
                  swiperRef.current.slidePrev();
                }
              }}
              className="bg-white lg:h-12 lg:w-12 h-9 w-9 rounded-full border border-primary flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-primary group-hover:text-background z-20 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <div className="absolute -left-0.5 h-16 w-16 rounded-full bg-primary translate-x-50 group-hover:translate-x-0 transition-transform duration-500  ease-in-out z-19"></div>
            </button>
          </div>
          <div className="lg:px-5 px-3 absolute top-0 right-0 z-10 flex h-full items-center transition-all duration-300 -translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperRef.current) {
                  swiperRef.current.slideNext();
                }
              }}
              className="bg-white lg:h-12 lg:w-12 h-9 w-9 rounded-full border border-primary flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-primary group-hover:text-background z-20 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
              <div className="absolute -left-0.5 h-16 w-16 rounded-full bg-primary -translate-x-20 group-hover:translate-x-0 transition-transform duration-500  ease-in-out z-19"></div>
            </button>
          </div>
          {/* Navigation Buttons */}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="mb-8">
          {p.spesific_gender === "male" ? (
            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
              <Mars className="size-4 text-primary" />
              <p className="text-primary text-sm!">{labels.male}</p>
            </div>
          ) : p.spesific_gender === "female" ? (
            <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
              <Venus className="size-4 text-pink-500" />
              <p className="text-pink-500 text-sm!">{labels.female}</p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
              <VenusAndMars className="size-4 text-health" />
              <p className="text-health text-sm!">{labels.unisex}</p>
            </div>
          )}
        </div>
        <h2 className="package_title font-bold text-primary">
          {locale === routing.defaultLocale ? p.id_title : p.en_title}
        </h2>
        <h6 className="package_tagline mt-2">
          {locale === routing.defaultLocale ? p.id_tagline : p.en_tagline}
        </h6>
        <div className="flex lg:flex-row flex-col lg:gap-8 gap-4 lg:items-center items-start my-5">
          <div>
            <p className="text-xs! font-medium text-muted-foreground mb-2">
              {labels.vendor}
            </p>
            <AvatarVendorHotel
              size="md"
              type="vendor"
              locale={locale}
              vendor_id={p.vendor_id}
            />
          </div>
          {p.hotel_id && (
            <div>
              <p className="text-xs! font-medium text-muted-foreground mb-2">
                Hotel
              </p>
              <AvatarVendorHotel
                size="md"
                type="hotel"
                hotel_id={p.hotel_id}
                locale={locale}
              />
            </div>
          )}
        </div>
        <div className="lg:hidden flex my-5">
          <PriceInfo
            labels={labels}
            payID={payID}
            real_price={p.real_price}
            discount_price={p.discount_price}
          />
        </div>
        <hr />
        <div className="flex flex-wrap lg:gap-5 gap-3 my-5">
          <div className="bg-white p-4 border inline-flex gap-5 rounded-2xl">
            <div className="inline-flex items-center gap-2">
              <Sun className="text-primary size-5" />{" "}
              <p>
                {p.duration_by_day} {labels.days}
              </p>
            </div>
            <div className="inline-flex items-center gap-2">
              <Moon className="text-primary size-5" />{" "}
              <p>
                {p.duration_by_night} {labels.night}
              </p>
            </div>
          </div>
          {p.included.map((inc, i) => (
            <div
              key={inc}
              className="bg-white p-4 border inline-flex gap-5 rounded-2xl"
            >
              <div className="inline-flex items-center gap-2 capitalize">
                <p>{inc}</p>
              </div>
            </div>
          ))}
        </div>
        <hr />

        <div className="flex flex-col gap-5 mt-5">
          <div className="bg-white p-4 border rounded-2xl">
            <p className="text-sm! text-muted-foreground">{labels.detail}</p>
            <div
              className="prose max-w-none -my-3"
              dangerouslySetInnerHTML={{
                __html:
                  locale === routing.defaultLocale
                    ? p.id_medical_package_content
                    : p.en_medical_package_content,
              }}
            />
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 lg:block hidden">
        <PriceInfo
          labels={labels}
          payID={payID}
          real_price={p.real_price}
          discount_price={p.discount_price}
        />
      </div>
    </ContainerWrap>
  );
};

export default MedicalDetailClient;
