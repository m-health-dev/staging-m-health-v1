"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Tracks the real browser URL pathname, including changes made via
 * `history.replaceState` / `history.pushState` which Next.js's
 * `usePathname()` does not detect.
 *
 * Works by:
 * 1. Patching `history.replaceState` and `history.pushState` to emit a
 *    custom `"locationchange"` event on every call.
 * 2. Listening for the custom `"urlchange"` event (already dispatched in
 *    `ChatStart.tsx` after `replaceState`).
 * 3. Listening for `"popstate"` (back / forward navigation).
 * 4. Falling back to Next.js `usePathname()` for server-side rendering
 *    and normal Next.js navigations.
 */

// ---------------------------------------------------------------------------
// Module-level history patching (runs once)
// ---------------------------------------------------------------------------
let patched = false;

function patchHistory() {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const originalReplaceState = window.history.replaceState.bind(
    window.history,
  );
  const originalPushState = window.history.pushState.bind(window.history);

  window.history.replaceState = function (
    data: any,
    unused: string,
    url?: string | URL | null,
  ) {
    originalReplaceState(data, unused, url);
    window.dispatchEvent(new Event("locationchange"));
  };

  window.history.pushState = function (
    data: any,
    unused: string,
    url?: string | URL | null,
  ) {
    originalPushState(data, unused, url);
    window.dispatchEvent(new Event("locationchange"));
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useRealPathname(): string {
  const nextPathname = usePathname();
  const [browserPathname, setBrowserPathname] = useState<string>("");

  useEffect(() => {
    // Ensure history is patched
    patchHistory();

    // Set initial value
    setBrowserPathname(window.location.pathname);

    const handleChange = () => {
      setBrowserPathname(window.location.pathname);
    };

    window.addEventListener("locationchange", handleChange);
    window.addEventListener("urlchange", handleChange);
    window.addEventListener("popstate", handleChange);

    return () => {
      window.removeEventListener("locationchange", handleChange);
      window.removeEventListener("urlchange", handleChange);
      window.removeEventListener("popstate", handleChange);
    };
  }, []);

  // Also sync when Next.js pathname changes (normal navigations)
  useEffect(() => {
    setBrowserPathname(window.location.pathname);
  }, [nextPathname]);

  // On the server (or first SSR render) browserPathname is "", so fall back
  // to the Next.js value. On the client the browser value is authoritative.
  return browserPathname || nextPathname;
}
