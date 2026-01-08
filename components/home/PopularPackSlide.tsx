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
                <SwiperSlide
                  key={slide.id}
                  className="justify-between rounded-2xl max-w-[300px] pb-2 group cursor-pointer flex grow"
                  onMouseEnter={() => setHoveredIndex(key)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="flex flex-col rounded-2xl w-full group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(key)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={`/${locale}/package/${slide.slug}`}
                      className="flex flex-col w-full h-[calc(100%-20px)] relative group-hover:shadow rounded-2xl transition-all duration-300"
                    >
                      <div className="relative">
                        <p className="absolute -bottom-2.5 left-0 text-muted-foreground bg-white px-4 pt-2 pb-5 rounded-t-2xl text-sm! mb-3 z-50 ">
                          {slide.duration_by_day} {labels.days}{" "}
                          {slide.duration_by_night} {labels.night}
                        </p>
                        <Image
                          src={slide.highlight_image} // TODO: Ganti dengan slide.full ketika sudah ada gambarnya
                          width={720}
                          height={405}
                          alt={
                            locale === "id" ? slide.id_title : slide.en_title
                          }
                          className="w-full aspect-square! object-cover object-center rounded-t-2xl border-0"
                        />
                      </div>

                      <div className="flex flex-col justify-center grow  max-w-full bg-white rounded-2xl -mt-5 p-4 h-full transition-all duration-100 z-50">
                        <div className="overflow-hidden">
                          <div>
                            <h5 className="capitalize font-bold text-primary line-clamp-3">
                              {locale === "id"
                                ? slide.id_title
                                : slide.en_title}
                            </h5>
                          </div>
                        </div>
                        <div className="mt-1 overflow-hidden">
                          <div>
                            <p className="text-muted-foreground line-clamp-2">
                              {locale === "id"
                                ? slide.id_tagline
                                : slide.en_tagline}
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
              <div
                key={key}
                className="flex flex-col rounded-2xl w-full group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(key)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  href={`/${locale}/package/${slide.slug}`}
                  className="flex flex-col w-full h-[calc(100%-20px)] relative group-hover:shadow-md rounded-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <p className="absolute -bottom-2.5 left-0 text-muted-foreground bg-white px-4 pt-2 pb-5 rounded-t-2xl text-sm! mb-3 z-50 ">
                      {slide.duration_by_day} {labels.days}{" "}
                      {slide.duration_by_night} {labels.night}
                    </p>
                    <Image
                      src={slide.highlight_image} // TODO: Ganti dengan slide.full ketika sudah ada gambarnya
                      width={720}
                      height={405}
                      alt={locale === "id" ? slide.id_title : slide.en_title}
                      className="w-full aspect-square! object-cover object-center rounded-t-2xl"
                    />
                  </div>

                  <div className="flex flex-col justify-center grow  max-w-full bg-white rounded-2xl -translate-y-5 p-4 h-full transition-all duration-100 z-50">
                    <div className="overflow-hidden">
                      <div>
                        <h5 className="capitalize font-bold text-primary line-clamp-3">
                          {locale === "id" ? slide.id_title : slide.en_title}
                        </h5>
                      </div>
                    </div>
                    <div className="mt-1 overflow-hidden">
                      <div>
                        <p className="text-muted-foreground line-clamp-2">
                          {locale === "id"
                            ? slide.id_tagline
                            : slide.en_tagline}
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
            ))}
          </div>
        )}
      </div>
    </ContainerWrap>
  );
}
