"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

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
// External store helpers for useSyncExternalStore
// ---------------------------------------------------------------------------
function subscribe(callback: () => void) {
  // Ensure history is patched
  patchHistory();

  window.addEventListener("locationchange", callback);
  window.addEventListener("urlchange", callback);
  window.addEventListener("popstate", callback);

  return () => {
    window.removeEventListener("locationchange", callback);
    window.removeEventListener("urlchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getSnapshot() {
  return window.location.pathname;
}

function getServerSnapshot(): string {
  // On the server we don't know the real URL; return empty and let Next.js
  // `usePathname()` take over on the first client render.
  return "";
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useRealPathname(): string {
  const nextPathname = usePathname();

  // useSyncExternalStore gives us a tear-free read of window.location.pathname
  const browserPathname = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // On the server (or first SSR render) browserPathname is "", so fall back
  // to the Next.js value. On the client the browser value is authoritative.
  return browserPathname || nextPathname;
}
