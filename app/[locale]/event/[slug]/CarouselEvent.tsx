"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { EventsType } from "@/types/events.types";

const CarouselEvent = ({ e }: { e: EventsType }) => {
  const swiperRef = useRef<any>(null);
  const sliderImage = [e.highlight_image, ...e.reference_image];
  return (
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
          <SwiperSlide key={key} className="border">
            <Image
              src={img}
              width={500}
              height={500}
              className="w-full aspect-square object-center object-cover"
              alt={img}
            />
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
  );
};

export default CarouselEvent;
