"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "boring-avatars";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";

const PopularProgramGrid = ({ data }: { data: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  if (data.length <= 0) {
    return <FailedGetDataNotice />;
  }
  const onlyGet8: any[] = data.slice(0, 8);
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-5">
      {onlyGet8.map((d, i) => (
        <div
          key={d.id}
          className="aspect-square relative group cursor-pointer"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Image
            src={d.full}
            width={500}
            height={500}
            alt={d.alt}
            className="object-center w-full h-full aspect-square object-cover rounded-2xl"
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
                    <h6 className="text-white font-bold capitalize lg:line-clamp-3 line-clamp-2">
                      {d.alt}
                    </h6>
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
                    <h6 className="text-white font-bold capitalize line-clamp-2">
                      {d.alt}
                    </h6>
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
                      {`${d.description}_Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Numquam dolore ab quo magni tempora nostrum accusantium,
              quia reiciendis, quasi totam ipsa id facilis. Beatae assumenda
              itaque perspiciatis asperiores nulla quos ea dolorum, placeat
              tempora incidunt commodi, consequatur ipsa molestiae nisi quaerat
              animi maiores aliquid. Velit, ad? Beatae deserunt ullam quo?`}
                    </p>
                    <div className="lg:inline-flex gap-2 items-center mt-5 hidden">
                      <Avatar
                        name={d.author.name}
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
                      <p className="text-sm! text-health">{d.author.name}</p>
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
                      {`${d.description}_Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Numquam dolore ab quo magni tempora nostrum accusantium,
              quia reiciendis, quasi totam ipsa id facilis. Beatae assumenda
              itaque perspiciatis asperiores nulla quos ea dolorum, placeat
              tempora incidunt commodi, consequatur ipsa molestiae nisi quaerat
              animi maiores aliquid. Velit, ad? Beatae deserunt ullam quo?`}
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
  );
};

export default PopularProgramGrid;
