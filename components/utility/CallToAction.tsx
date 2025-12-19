"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import ContainerWrap from "./ContainerWrap";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, delay: 2 },
  },
};

const CallToAction = () => {
  const t = useTranslations("cta");
  const highlights = t.raw("highlights") as string[];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % highlights.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [highlights.length]);

  return (
    <>
      <ContainerWrap>
        <div className="flex flex-col justify-center items-center h-[50vh] text-center">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-extrabold text-primary text-3xl md:text-4xl"
          >
            {t("title")}{" "}
            <span className="relative inline-block w-auto text-health">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  variants={textVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="sticky left-0 top-0"
                >
                  {highlights[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.h5
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-medium mt-6 text-muted-foreground"
          >
            {t("subtitle")}
          </motion.h5>
        </div>
      </ContainerWrap>

      <div className="bg-linear-to-b from-background to-white w-full h-52" />
    </>
  );
};

export default CallToAction;
