"use client";

import useSWR from "swr";
import { getAllPublicPackages } from "@/lib/packages/get-packages";
import { getAllPublicMedical } from "@/lib/medical/get-medical";
import { getAllPublicWellness } from "@/lib/wellness/get-wellness";

const SIDEBAR_CACHE_KEY = "sidebar-data";

export function useSidebarData() {
  const { data: packages, isLoading: packagesLoading } = useSWR(
    `${SIDEBAR_CACHE_KEY}-packages`,
    () => getAllPublicPackages(1, 3),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const { data: medical, isLoading: medicalLoading } = useSWR(
    `${SIDEBAR_CACHE_KEY}-medical`,
    () => getAllPublicMedical(1, 3),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const { data: wellness, isLoading: wellnessLoading } = useSWR(
    `${SIDEBAR_CACHE_KEY}-wellness`,
    () => getAllPublicWellness(1, 3),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    packages: Array.isArray(packages?.data) ? packages.data : [],
    medical: Array.isArray(medical?.data) ? medical.data : [],
    wellness: Array.isArray(wellness?.data) ? wellness.data : [],
    isLoading: packagesLoading || medicalLoading || wellnessLoading,
  };
}
