"use client";

import React from "react";
import LazySection from "@/components/utility/LazySection";
import {
  PopularPackageSkeleton,
  PopularProgramSkeleton,
  PopularMedicalSkeleton,
  CurrentEventsSkeleton,
  OurNewsSkeleton,
} from "@/components/home/HomeSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import ContainerWrap from "@/components/utility/ContainerWrap";

// Simple placeholder untuk section yang belum visible
const SectionPlaceholder = ({ height = "400px" }: { height?: string }) => (
  <div className="w-full" style={{ minHeight: height }} />
);

// CallToAction Skeleton
const CallToActionSkeleton = () => (
  <ContainerWrap className="py-16">
    <div className="flex flex-col items-center space-y-6">
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-5 w-96" />
      <Skeleton className="h-12 w-40 rounded-full" />
    </div>
  </ContainerWrap>
);

interface HomeLazySectionsProps {
  popularPackage: React.ReactNode;
  popularProgram: React.ReactNode;
  popularMedical: React.ReactNode;
  currentEvents: React.ReactNode;
  ourNews: React.ReactNode;
  callToAction: React.ReactNode;
}

/**
 * HomeLazySections - Client component untuk lazy loading sections di home page
 * Menggunakan Intersection Observer untuk load bertahap
 */
const HomeLazySections: React.FC<HomeLazySectionsProps> = ({
  popularPackage,
  popularProgram,
  popularMedical,
  currentEvents,
  ourNews,
  callToAction,
}) => {
  return (
    <>
      {/* Popular Package - Load lebih awal karena dekat dengan Jumbotron */}
      <LazySection
        fallback={<PopularPackageSkeleton />}
        minHeight="500px"
        rootMargin="500px"
      >
        {popularPackage}
      </LazySection>

      {/* Popular Program */}
      <LazySection
        fallback={<PopularProgramSkeleton />}
        minHeight="600px"
        rootMargin="400px"
      >
        {popularProgram}
      </LazySection>

      {/* Popular Medical */}
      <LazySection
        fallback={<PopularMedicalSkeleton />}
        minHeight="500px"
        rootMargin="300px"
      >
        {popularMedical}
      </LazySection>

      {/* Current Events */}
      <LazySection
        fallback={<CurrentEventsSkeleton />}
        minHeight="500px"
        rootMargin="300px"
      >
        {currentEvents}
      </LazySection>

      {/* Our News */}
      <LazySection
        fallback={<OurNewsSkeleton />}
        minHeight="500px"
        rootMargin="300px"
      >
        {ourNews}
      </LazySection>

      {/* Call To Action */}
      <LazySection
        fallback={<CallToActionSkeleton />}
        minHeight="200px"
        rootMargin="200px"
      >
        {callToAction}
      </LazySection>
    </>
  );
};

export default HomeLazySections;
