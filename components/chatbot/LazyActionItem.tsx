"use client";

import React, { useRef, useState, useEffect, ReactNode, Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

interface LazyActionItemProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
  className?: string;
  index?: number;
  delay?: number; // delay dalam ms sebelum render setelah visible
}

/**
 * LazyActionItem - Komponen untuk lazy loading action cards di chat
 * Menggunakan Intersection Observer API untuk deteksi viewport
 * Dengan tambahan delay untuk efek muncul bergantian
 */
const LazyActionItem: React.FC<LazyActionItemProps> = ({
  children,
  fallback,
  rootMargin = "100px",
  threshold = 0.1,
  minHeight = "200px",
  className = "",
  index = 0,
  delay = 150, // delay per item dalam ms
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;

    // Jika sudah pernah load, tidak perlu observe lagi
    if (hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasLoaded(true);
            // Unobserve setelah visible untuk performa
            if (currentRef) {
              observer.unobserve(currentRef);
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold, hasLoaded]);

  // Tambahkan delay setelah visible untuk efek bergantian
  useEffect(() => {
    if (isVisible && !shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, index * delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, index, delay, shouldRender]);

  const defaultFallback = (
    <div className="space-y-3 animate-pulse">
      <Skeleton className="h-6 w-40" />
      <div className="flex gap-4 overflow-hidden p-5 rounded-2xl bg-background">
        <Skeleton className="lg:w-4/10 w-9/10 h-[200px] shrink-0 rounded-xl" />
        <Skeleton className="lg:w-4/10 w-9/10 h-[200px] shrink-0 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{ minHeight: !hasLoaded ? minHeight : undefined }}
    >
      {shouldRender ? (
        <Suspense fallback={fallback || defaultFallback}>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazyActionItem;
