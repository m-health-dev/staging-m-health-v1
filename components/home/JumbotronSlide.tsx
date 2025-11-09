"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import "swiper/css/effect-fade";

export default function JumbotronSlide({ data }: { data: any[] }) {
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
            modules={[Navigation, Autoplay, Pagination, EffectFade]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={true}
            grabCursor={true}
            effect={"fade"}
            spaceBetween={20}
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
            {data.map((slide, key) => (
              <SwiperSlide key={key}>
                <Link href={slide.author.profile} target="_blank">
                  <Image
                    src={slide.full}
                    width={720}
                    height={405}
                    alt={slide.alt}
                    className="aspect-20/7 w-full object-cover object-center rounded-2xl"
                  />
                </Link>
                {/* <div className="max-w-full mt-5">
                  <p className="text-muted-foreground mb-0.5">{slide.id}</p>
                  <h3 className="capitalize font-semibold text-primary">
                    {slide.alt}
                  </h3>
                  <p className="line-clamp-2 mt-5">
                    {slide.author.name} - Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit. Consequatur, aliquam.
                  </p>
                </div> */}
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
