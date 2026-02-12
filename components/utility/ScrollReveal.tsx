"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before playing the animation after entering viewport */
  delay?: number;
  /** rootMargin for IntersectionObserver – pre-trigger distance */
  rootMargin?: string;
  /** threshold 0-1 */
  threshold?: number;
  /** Animation variant */
  variant?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "fade";
  /** Duration in ms */
  duration?: number;
}

const variantStyles: Record<string, { from: React.CSSProperties; to: React.CSSProperties }> = {
  "fade-up": {
    from: { opacity: 0, transform: "translateY(24px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-down": {
    from: { opacity: 0, transform: "translateY(-24px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    from: { opacity: 0, transform: "translateX(-24px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    from: { opacity: 0, transform: "translateX(24px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  zoom: {
    from: { opacity: 0, transform: "scale(0.92)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  rootMargin = "0px 0px -40px 0px",
  threshold = 0.1,
  variant = "fade-up",
  duration = 500,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(el);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [delay, rootMargin, threshold]);

  const style = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...(isVisible ? style.to : style.from),
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1), transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
