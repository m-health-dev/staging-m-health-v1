"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Star, StarOff } from "lucide-react";
import { Button } from "../ui/button";
import ContainerWrap from "../utility/ContainerWrap";
import Avatar from "boring-avatars";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { PackageType } from "@/types/packages.types";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import { useTranslations } from "next-intl";
import PackageCard from "../package/package-card";

export default function PopularPackSlide({
  packages,
  locale,
  labels,
}: {
  packages: PackageType[];
  locale: string;
  labels: any;
}) {
  const swiperRef = useRef<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const t = useTranslations("utility");

  console.log("Popular Pack Slide packages:", packages.length);

  if (!Array.isArray(packages) || packages.length <= 0) {
    return (
      <ContainerWrap>
        <FailedGetDataNotice />
      </ContainerWrap>
    );
  }

  return (
    <ContainerWrap type={packages.length >= 5 ? "carousel" : "default"}>
      <div className="lg:my-10 my-8 overflow-hidden">
        {packages.length >= 10 ? (
          <div className="w-full flex-col items-center relative group/slide">
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              loop={true}
              grabCursor={true}
              spaceBetween={10}
              centeredSlides={true}
              breakpoints={{
                280: { slidesPerView: "auto", spaceBetween: 15 },
                640: { slidesPerView: "auto", spaceBetween: 15 }, // tablet
                1024: { slidesPerView: "auto", spaceBetween: 20 }, // desktop biasa
                1920: { slidesPerView: "auto", spaceBetween: 20 }, // 1440p
              }}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              className="w-full "
            >
              {packages.map((slide, key) => (
                <PackageCard
                  key={slide.id}
                  slide={slide}
                  locale={locale}
                  labels={labels}
                  type="swiper"
                />
              ))}
            </Swiper>
            {/* <div className="absolute right-0 top-0 lg:w-32 w-5 h-full bg-linear-to-l from-background z-10"></div>
            <div className="absolute left-0 top-0 lg:w-32 w-5 h-full bg-linear-to-r from-background z-10"></div> */}
            <div className="lg:px-10 px-3 absolute top-0 left-0 z-20 lg:flex hidden h-full items-center transition-all duration-300 lg:translate-x-20 lg:group-hover/slide:translate-x-0 lg:opacity-0 lg:group-hover/slide:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (swiperRef.current) {
                    swiperRef.current.slidePrev();
                  }
                }}
                className="bg-white h-12 w-12 rounded-full border border-primary flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
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
            <div className="lg:px-10 px-3 absolute top-0 right-0 z-10 lg:flex hidden h-full items-center transition-all duration-300 lg:-translate-x-20 lg:group-hover/slide:translate-x-0 lg:opacity-0 lg:group-hover/slide:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (swiperRef.current) {
                    swiperRef.current.slideNext();
                  }
                }}
                className="bg-white h-12 w-12 rounded-full border border-primary flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
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
          </div>
        ) : (
          <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 lg:pb-0 px-2">
            {packages.map((slide, key) => (
              <PackageCard
                key={slide.id}
                slide={slide}
                locale={locale}
                labels={labels}
              />
            ))}
          </div>
        )}
      </div>
    </ContainerWrap>
  );
}
