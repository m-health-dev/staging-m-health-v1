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

export default function PopularMedSlide({
  data,
  hospital,
}: {
  data: any[];
  hospital: RumahSakit[];
}) {
  const swiperRef = useRef<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length <= 0) {
    return (
      <ContainerWrap>
        <FailedGetDataNotice />
      </ContainerWrap>
    );
  }

  return (
    <>
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
                280: { slidesPerView: "auto", spaceBetween: 10 },
                640: { slidesPerView: "auto", spaceBetween: 10 }, // tablet
                1024: { slidesPerView: "auto", spaceBetween: 15 }, // desktop biasa
                1920: { slidesPerView: "auto", spaceBetween: 20 }, // 1440p
              }}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 7500,
                disableOnInteraction: true,
              }}
              className="w-full "
            >
              {data.map((slide, key) => (
                <SwiperSlide
                  key={key}
                  className="flex flex-col justify-between rounded-2xl mb-2 max-w-[280px] 3xl:min-h-[45vh] 3xl:max-h-[45vh]  min-h-[60vh] max-h-[60vh] group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(key)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={slide.full}
                    width={720}
                    height={405}
                    alt={slide.alt}
                    className="w-full aspect-square! object-cover object-center rounded-t-2xl -z-10"
                  />

                  <motion.div
                    initial={{ y: 0, z: 50 }}
                    animate={{ y: hoveredIndex === key ? -100 : 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="flex flex-col justify-center grow max-w-full bg-white border rounded-2xl -mt-5 p-4 h-full shadow transition-all duration-300 z-50"
                  >
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
                      <AnimatePresence mode="wait">
                        {hoveredIndex === key ? (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 1, height: 30 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 1, height: 30 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <h6 className="capitalize font-bold text-primary line-clamp-3">
                              {slide.alt}
                            </h6>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short"
                            initial={{ opacity: 1, height: 60 }}
                            animate={{ opacity: 1, height: 60 }}
                            exit={{ opacity: 1, height: 60 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <h6 className="capitalize font-bold text-primary line-clamp-2">
                              {slide.alt}
                            </h6>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="mt-2 overflow-hidden">
                      <AnimatePresence mode="wait">
                        {hoveredIndex === key ? (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 1, height: 40 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 1, height: 40 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <p className="text-muted-foreground line-clamp-5 text-sm!">
                              {`${slide.description}` +
                                `_` +
                                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
          quaerat nobis fugiat praesentium officia quis, quidem voluptatum eos.
          Quae nemo earum quis cum labore fuga nihil! Sit illum dolores
          perspiciatis minus molestiae consequuntur? Rerum quisquam, cumque
          voluptatem ipsum libero inventore qui. Quo obcaecati et repudiandae,
          tempora quisquam doloremque quaerat molestiae.`}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short"
                            initial={{ opacity: 1, height: 40 }}
                            animate={{ opacity: 1, height: 40 }}
                            exit={{ opacity: 1, height: 40 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <p className="text-muted-foreground text-sm! line-clamp-2">
                              {`${slide.description}` +
                                `_` +
                                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
          quaerat nobis fugiat praesentium officia quis.`}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
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
          <ContainerWrap>
            <div className="grid 3xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-1 lg:gap-3 gap-32 lg:pb-0 pb-[30vh]">
              {data.map((slide, key) => (
                <div
                  key={key}
                  className="flex flex-col justify-between rounded-2xl mb-2 lg:max-w-[280px] w-full 3xl:min-h-[35vh] 3xl:max-h-[35vh] min-h-[60vh] max-h-[60vh] group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(key)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={slide.full}
                    width={720}
                    height={405}
                    alt={slide.alt}
                    className="w-full aspect-square! object-cover object-center rounded-t-2xl"
                  />

                  <motion.div
                    initial={{ y: 0, z: 50 }}
                    animate={{ y: hoveredIndex === key ? -100 : 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="flex flex-col justify-center grow max-w-full bg-white border rounded-2xl -mt-5 p-4 h-full shadow transition-all duration-300 z-50"
                  >
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
                      <AnimatePresence mode="wait">
                        {hoveredIndex === key ? (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 1, height: 30 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 1, height: 30 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <h6 className="capitalize font-bold text-primary line-clamp-3">
                              {slide.alt}
                            </h6>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short"
                            initial={{ opacity: 1, height: 30 }}
                            animate={{ opacity: 1, height: 30 }}
                            exit={{ opacity: 1, height: 30 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <h6 className="capitalize font-bold text-primary line-clamp-1">
                              {slide.alt}
                            </h6>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="mt-2 overflow-hidden">
                      <AnimatePresence mode="wait">
                        {hoveredIndex === key ? (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 1, height: 40 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 1, height: 40 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <p className="text-muted-foreground line-clamp-5 text-sm!">
                              {`${slide.description}` +
                                `_` +
                                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
          quaerat nobis fugiat praesentium officia quis, quidem voluptatum eos.
          Quae nemo earum quis cum labore fuga nihil! Sit illum dolores
          perspiciatis minus molestiae consequuntur? Rerum quisquam, cumque
          voluptatem ipsum libero inventore qui. Quo obcaecati et repudiandae,
          tempora quisquam doloremque quaerat molestiae.`}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short"
                            initial={{ opacity: 1, height: 40 }}
                            animate={{ opacity: 1, height: 40 }}
                            exit={{ opacity: 1, height: 40 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <p className="text-muted-foreground text-sm! line-clamp-2">
                              {`${slide.description}` +
                                `_` +
                                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
          quaerat nobis fugiat praesentium officia quis.`}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </ContainerWrap>
        )}
      </div>
    </>
  );
}
