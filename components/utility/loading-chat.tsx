"use client";

import { Spinner } from "@/components/ui/spinner";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { routing } from "@/i18n/routing";

const LoadingChat = ({
  className,
  locale,
}: {
  className?: string;
  locale?: string;
}) => {
  const [dot, setDot] = useState("");
  const [phase, setPhase] = useState(0); // 0 = LOADING, 1 = FETCH, 2 = WAIT

  // Animasi titik
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDot((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const timer0 = setPhase(0);
    const timer1 = setTimeout(() => setPhase(1), 3000);
    const timer2 = setTimeout(() => setPhase(2), 10000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const text =
    phase === 0
      ? locale === routing.defaultLocale
        ? "Memuat"
        : "Loading"
      : phase === 1
      ? locale === routing.defaultLocale
        ? "Membaca Data"
        : "Read Data"
      : locale === routing.defaultLocale
      ? "Menggali Informasi"
      : "Searching Information";

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center justify-start rounded-2xl gap-2 text-primary opacity-75",
        "min-w-52"
      )}
    >
      <Spinner />

      {/* Fade + slide animasi untuk teks */}
      <AnimatePresence mode="popLayout">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-sm truncate"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

export default LoadingChat;
