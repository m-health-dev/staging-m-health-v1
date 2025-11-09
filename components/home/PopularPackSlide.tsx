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

export default function PopularPackSlide({ data }: { data: any[] }) {
  const swiperRef = useRef<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data) {
    return notFound();
  }

  return (
    <>
      <div className="lg:my-10 my-8 overflow-hidden">
        {data.length >= 10 ? (
          <div className="w-full flex flex-col items-center relative group/slide">
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
                delay: 5000,
                disableOnInteraction: true,
              }}
              className="w-full "
            >
              {data.map((slide, key) => (
                <SwiperSlide
                  key={key}
                  className="flex flex-col justify-between rounded-2xl mb-2 max-w-[280px] 3xl:min-h-[35vh] 3xl:max-h-[35vh]  min-h-[55vh] max-h-[55vh] group cursor-pointer"
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
                    className="flex flex-col justify-center grow max-w-full bg-white rounded-2xl -mt-5 p-4 h-full shadow transition-all duration-300 z-50"
                  >
                    <p className="text-muted-foreground text-sm! mb-1">
                      {key} Day {key === 0 ? key + 1 : key - 1} Night
                    </p>

                    <div className="overflow-hidden">
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
                            <p className="capitalize font-semibold text-primary line-clamp-3">
                              {slide.alt}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short"
                            initial={{ opacity: 1, height: 20 }}
                            animate={{ opacity: 1, height: 20 }}
                            exit={{ opacity: 1, height: 40 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <p className="capitalize font-semibold text-primary line-clamp-1">
                              {slide.alt}
                            </p>
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
                    <div className="inline-flex gap-2 items-center mt-5">
                      <Avatar
                        name={slide.author.name}
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
                      <p className="text-sm! text-health">
                        {slide.author.name}
                      </p>
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
            <div className="grid 3xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
              {data.map((slide, key) => (
                <div
                  key={key}
                  className="flex flex-col justify-between rounded-2xl mb-2 max-w-[280px] 3xl:min-h-[35vh] 3xl:max-h-[35vh]  min-h-[55vh] max-h-[55vh] group cursor-pointer"
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
                    className="flex flex-col justify-center grow max-w-full bg-white rounded-2xl -mt-5 p-4 h-full shadow transition-all duration-300 z-50"
                  >
                    <p className="text-muted-foreground text-sm! mb-1">
                      {key} Day {key === 0 ? key + 1 : key - 1} Night
                    </p>

                    <div className="overflow-hidden">
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
                            <p className="capitalize font-semibold text-primary line-clamp-3 text-sm!">
                              {slide.alt}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short"
                            initial={{ opacity: 1, height: 20 }}
                            animate={{ opacity: 1, height: 20 }}
                            exit={{ opacity: 1, height: 40 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <p className="capitalize font-semibold text-primary text-sm! line-clamp-1">
                              {slide.alt}
                            </p>
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
                    <div className="inline-flex gap-2 items-center mt-5">
                      <Avatar
                        name={slide.author.name}
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
                      <p className="text-sm! text-health">
                        {slide.author.name}
                      </p>
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
