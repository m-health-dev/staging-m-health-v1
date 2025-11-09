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

export default function PopularPackSlide({ data }: { data: any[] }) {
  const swiperRef = useRef<any>(null);

  // const [images, setImages] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchImages() {
  //     setLoading(true);
  //     const res = await fetch(
  //       "/api/unsplash?query=indonesia&page=5&per_page=8"
  //     );
  //     const data = await res.json();
  //     setImages(data.results || []);
  //     setLoading(false);
  //   }
  //   fetchImages();
  // }, []);

  if (!data) {
    return notFound();
  }

  return (
    <>
      <div className="lg:my-10 my-8 overflow-hidden">
        <div className="w-full flex flex-col items-center relative group/slide">
          {/* Swiper Container */}
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={true}
            grabCursor={true}
            spaceBetween={10}
            slidesPerView={"auto"}
            centeredSlides={true}
            breakpoints={{
              280: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 12 }, // tablet
              1024: { slidesPerView: 6.5, spaceBetween: 15 }, // desktop biasa
              1920: { slidesPerView: 8, spaceBetween: 20 }, // 1440p
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full "
          >
            {data.map((slide, key) => (
              <SwiperSlide
                key={key}
                className="flex flex-col justify-between grow min-h-[430px] max-h-[430px] bg-white rounded-2xl border shadow mb-2"
              >
                <Link href={slide.author.profile} target="_blank">
                  <Image
                    src={slide.full}
                    width={720}
                    height={405}
                    alt={slide.alt}
                    className="w-full aspect-square! object-cover object-center rounded-t-2xl"
                  />
                </Link>
                <div className="flex flex-col justify-between grow max-w-full pt-5 pb-2 px-3 h-full">
                  <p className="text-muted-foreground mb-0.5">
                    {key} Day {key === 0 ? key + 1 : key - 1} Night
                  </p>
                  <p className="capitalize font-semibold text-primary line-clamp-2">
                    {slide.alt}
                  </p>

                  <div className="flex flex-row gap-1 mt-2"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="lg:px-10 px-3 absolute top-0 left-0 z-20 flex h-full items-center transition-all duration-300 translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
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
          <div className="lg:px-10 px-3 absolute top-0 right-0 z-10 flex h-full items-center transition-all duration-300 -translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
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
    </>
  );
}
