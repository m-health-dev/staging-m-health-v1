"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "boring-avatars";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { WellnessType } from "@/types/wellness.types";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";

const PopularProgramGrid = ({ data }: { data: WellnessType[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  if (data.length <= 0) {
    return <FailedGetDataNotice />;
  }

  const locale = useLocale();
  const onlyGet8: WellnessType[] = data.slice(0, 8);
  const onlyGet4: WellnessType[] = data.slice(0, 4);
  return (
    <>
      <div className="lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-5 lg:grid hidden">
        {onlyGet8.map((d, i) => (
          <div
            key={d.id}
            className="aspect-square relative group cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={d.highlight_image}
              width={500}
              height={500}
              alt={d.slug}
              className="object-center w-full h-full aspect-square object-cover rounded-2xl group-hover:outline-2 group-hover:outline-health transition-all duration-100"
            />
            <motion.div
              initial={{ y: 0, z: 50 }}
              animate={{ y: hoveredIndex === i ? 0 : 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="absolute bottom-0 z-10 lg:p-5 p-3 transition-all duration-300 h-auto"
            >
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  {hoveredIndex === i ? (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 1, height: 28 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 1, height: 28 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="text-white text-lg! font-bold capitalize lg:line-clamp-3 line-clamp-2">
                        {locale === routing.defaultLocale
                          ? d.id_title
                          : d.en_title}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="short"
                      initial={{ opacity: 1, height: 28 }}
                      animate={{ opacity: 1, height: 28 }}
                      exit={{ opacity: 1, height: 28 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="text-white text-lg! font-bold capitalize line-clamp-2">
                        {locale === routing.defaultLocale
                          ? d.id_title
                          : d.en_title}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  hoveredIndex === i ? "lg:mt-1 mt-1" : "lg:mt-1 -mt-1"
                }`}
              >
                <AnimatePresence mode="wait">
                  {hoveredIndex === i ? (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 1, height: 30 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 1, height: 30 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="text-white/50 lg:line-clamp-3 lg:text-base! text-sm! line-clamp-2">
                        {locale === routing.defaultLocale
                          ? d.id_tagline
                          : d.en_tagline}
                      </p>
                      <div className="flex w-full! mt-5">
                        <AvatarVendorHotel
                          type="vendor"
                          vendor_id={d.vendor_id}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="short"
                      initial={{ opacity: 1, height: 30 }}
                      animate={{ opacity: 1, height: 30 }}
                      exit={{ opacity: 1, height: 30 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="text-white/50 lg:text-base! text-sm! line-clamp-1">
                        {locale === routing.defaultLocale
                          ? d.id_tagline
                          : d.en_tagline}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            <div className="bg-linear-to-t from-black absolute bottom-0 w-full group-hover:h-full transition-all duration-300 delay-300 h-1/2 rounded-2xl"></div>
          </div>
        ))}
      </div>
      <div className="flex-col gap-5 lg:hidden flex">
        {onlyGet4.map((d, i) => (
          <div
            key={d.id}
            className="aspect-square relative group cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={d.highlight_image}
              width={500}
              height={500}
              alt={d.slug}
              className="object-center w-full h-full aspect-square object-cover rounded-2xl group-hover:outline-2 group-hover:outline-health transition-all duration-100"
            />
            <div className="absolute bottom-0 z-10 lg:p-5 p-3 transition-all duration-300 h-auto">
              <div className="overflow-hidden">
                <div>
                  <h5 className="text-white font-bold capitalize lg:line-clamp-3 line-clamp-2">
                    {locale === routing.defaultLocale ? d.id_title : d.en_title}
                  </h5>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  hoveredIndex === i ? "lg:mt-1 mt-1" : "lg:mt-1 mt-1"
                }`}
              >
                <motion.div
                  key="expanded"
                  initial={{ opacity: 1, height: 30 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 1, height: 30 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                >
                  <p className="text-white/50 lg:line-clamp-3 lg:text-base! text-sm! line-clamp-2">
                    {locale === routing.defaultLocale
                      ? d.id_tagline
                      : d.en_tagline}
                  </p>
                  <div className="mt-5">
                    <AvatarVendorHotel type="vendor" vendor_id={d.vendor_id} />
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="bg-linear-to-t from-black absolute bottom-0 w-full transition-all duration-300 delay-300 h-full rounded-2xl"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PopularProgramGrid;
