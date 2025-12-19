import type { Variants } from "framer-motion";

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.7, // delay antar item
      delayChildren: 0.7, // delay awal sebelum animasi mulai
    },
  },
};

export const fadeUpItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // easeOut cubic-bezier ✅
    },
  },
};
