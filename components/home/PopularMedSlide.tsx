"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, StarOff } from "lucide-react";
import { Button } from "../ui/button";
import ContainerWrap from "../utility/ContainerWrap";
import Avatar from "boring-avatars";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { RumahSakit } from "@/lib/dummyRS";
import { routing } from "@/i18n/routing";
import { MedicalType } from "@/types/medical.types";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";

export default function PopularMedSlide({
  data,
  locale,
  hospital,
}: {
  data: MedicalType[];
  locale: string;
  hospital: RumahSakit[];
}) {
  const swiperRef = useRef<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <ContainerWrap>
        <FailedGetDataNotice />
      </ContainerWrap>
    );
  }

  return (
    <ContainerWrap type={data.length >= 5 ? "carousel" : "default"}>
      <div className="overflow-hidden">
        {data.length >= 5 ? (
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
                delay: 7500,
                disableOnInteraction: true,
              }}
              className="w-full"
            >
              {data.map((slide, key) => (
                <SwiperSlide
                  key={key}
                  className="flex flex-col justify-between rounded-2xl mb-2 max-w-[280px] group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(key)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={"https://placehold.co/500x500.png"}
                    width={720}
                    height={405}
                    alt={
                      locale === routing.defaultLocale
                        ? slide.id_title
                        : slide.en_title
                    }
                    className="w-full aspect-square! object-cover object-center rounded-t-2xl -z-10"
                  />

                  <div className="flex flex-col justify-center 3xl:min-h-[15vh] min-h-[22vh] grow max-w-full bg-white border rounded-2xl -translate-y-5 p-4 h-full shadow transition-all duration-100 z-50  group-hover:outline-2 group-hover:outline-primary">
                    <div className="inline-flex gap-2 items-center">
                      <Avatar
                        name={hospital[key + 2].nama}
                        colors={[
                          "#3e77ab",
                          "#22b26e",
                          "#f2f26f",
                          "#fff7bd",
                          "#95cfb7",
                        ]}
                        variant="beam"
                        size={20}
                      />
                      <p className="text-xs! text-health normal-case line-clamp-1">
                        {hospital[key + 2].nama}
                      </p>
                    </div>
                    <div className="overflow-hidden mt-2">
                      <div>
                        <h6 className="capitalize font-bold text-primary line-clamp-2">
                          {locale === routing.defaultLocale
                            ? slide.id_title
                            : slide.en_title}
                        </h6>
                      </div>
                    </div>
                    <div className="mt-2 overflow-hidden">
                      <div>
                        <p className="text-muted-foreground text-sm! line-clamp-2">
                          {locale === routing.defaultLocale
                            ? slide.id_tagline
                            : slide.en_tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* <div className="absolute right-0 top-0 lg:w-32 w-5 h-full bg-linear-to-l from-health z-10"></div>
            <div className="absolute left-0 top-0 lg:w-32 w-5 h-full bg-linear-to-r from-health z-10"></div> */}
            <div className="lg:px-10 px-3 absolute top-0 left-0 z-20 lg:flex hidden h-full items-center transition-all duration-300 lg:translate-x-20 lg:group-hover/slide:translate-x-0 lg:opacity-0 lg:group-hover/slide:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (swiperRef.current) {
                    swiperRef.current.slidePrev();
                  }
                }}
                className="bg-white h-12 w-12 rounded-full border border-health flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-health group-hover:text-background z-20 transition-all duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                <div className="absolute -left-0.5 h-16 w-16 rounded-full bg-health translate-x-50 group-hover:translate-x-0 transition-transform duration-500  ease-in-out z-19"></div>
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
                className="bg-white h-12 w-12 rounded-full border border-health flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-health group-hover:text-background z-20 transition-all duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
                <div className="absolute -left-0.5 h-16 w-16 rounded-full bg-health -translate-x-20 group-hover:translate-x-0 transition-transform duration-500  ease-in-out z-19"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 lg:pb-0 px-2">
            {data.map((slide, key) => (
              <Link
                href={`/${locale}/medical/${slide.slug}`}
                key={key}
                className="flex flex-col rounded-2xl mb-2 w-full group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(key)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={slide.highlight_image}
                  width={720}
                  height={405}
                  alt={
                    locale === routing.defaultLocale
                      ? slide.id_title
                      : slide.en_title
                  }
                  className="w-full aspect-square! object-cover object-center rounded-t-2xl"
                />

                <div className="flex flex-col justify-center  3xl:min-h-[15vh] min-h-[22vh] max-w-full bg-white border rounded-2xl -mt-5 p-4 h-full shadow transition-all duration-100 group-hover:outline-2 group-hover:outline-primary z-50">
                  <AvatarVendorHotel
                    type="vendor"
                    vendor_id={slide.vendor_id}
                  />

                  <div className="overflow-hidden mt-2">
                    <div>
                      <p className="capitalize font-bold text-primary text-lg!  lg:line-clamp-2 line-clamp-1">
                        {locale === routing.defaultLocale
                          ? slide.id_title
                          : slide.en_title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 overflow-hidden">
                    <div>
                      <p className="text-muted-foreground text-sm! line-clamp-2">
                        {locale === routing.defaultLocale
                          ? slide.id_tagline
                          : slide.en_tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ContainerWrap>
  );
}
