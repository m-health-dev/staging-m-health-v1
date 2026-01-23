"use client";

import { useEffect, useState } from "react";

export function useResponsiveSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // if (typeof window === "undefined") return;
    // Fungsi untuk cek ukuran layar
    const checkScreenSize = () => {
      const isDesktop = window.matchMedia("(min-width: 1300px)").matches; // >= 1024px = laptop
      setIsSidebarOpen(isDesktop); // true di laptop, false di HP/tablet
    };

    // Jalankan pertama kali saat mount
    checkScreenSize();

    // Update jika ukuran layar berubah (misal user rotate HP / resize browser)
    window.addEventListener("resize", checkScreenSize);

    // Bersihkan event listener saat unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return { isSidebarOpen, setIsSidebarOpen };
}
