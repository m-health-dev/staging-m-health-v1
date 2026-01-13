"use client";

import { useEffect, useState } from "react";

export function useSidebarState() {
  // Always start with false on server to avoid hydration mismatch
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem("m-health-sidebar-open");
    if (saved) {
      setSidebarOpen(JSON.parse(saved));
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(
        "m-health-sidebar-open",
        JSON.stringify(sidebarOpen)
      );
    }
  }, [sidebarOpen, isInitialized]);

  return { sidebarOpen, setSidebarOpen };
}
