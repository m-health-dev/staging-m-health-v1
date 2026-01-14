"use client";

import React, { useRef, useState, useEffect, ReactNode, Suspense } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
  className?: string;
}

/**
 * LazySection - Komponen untuk lazy loading konten saat masuk viewport
 * Menggunakan Intersection Observer API untuk deteksi viewport
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = null,
  rootMargin = "200px", // Pre-load 200px sebelum masuk viewport
  threshold = 0,
  minHeight = "200px",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
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
      }
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

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{ minHeight: !hasLoaded ? minHeight : undefined }}
    >
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazySection;
