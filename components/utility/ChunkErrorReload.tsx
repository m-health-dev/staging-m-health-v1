"use client";

import { useEffect } from "react";

/**
 * Handles chunk load errors that occur after redeployment.
 * When a new build is deployed, old chunk hashes no longer exist on the server.
 * This component listens for such errors and auto-reloads the page once.
 */
export default function ChunkErrorReload() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      const error = event.error;

      const isChunkError =
        message.includes("Failed to fetch dynamically imported module") ||
        message.includes("Loading chunk") ||
        message.includes("Failed to load chunk") ||
        message.includes("ChunkLoadError") ||
        (error?.name === "ChunkLoadError") ||
        message.includes("Loading CSS chunk");

      if (isChunkError) {
        // Prevent infinite reload loop: only reload once per session
        const reloadKey = "chunk_error_reload";
        const lastReload = sessionStorage.getItem(reloadKey);
        const now = Date.now();

        if (!lastReload || now - parseInt(lastReload) > 10000) {
          sessionStorage.setItem(reloadKey, now.toString());
          window.location.reload();
        }
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason?.message || "";

      const isChunkError =
        message.includes("Failed to fetch dynamically imported module") ||
        message.includes("Loading chunk") ||
        message.includes("Failed to load chunk") ||
        message.includes("ChunkLoadError") ||
        (reason?.name === "ChunkLoadError") ||
        message.includes("Loading CSS chunk");

      if (isChunkError) {
        const reloadKey = "chunk_error_reload";
        const lastReload = sessionStorage.getItem(reloadKey);
        const now = Date.now();

        if (!lastReload || now - parseInt(lastReload) > 10000) {
          sessionStorage.setItem(reloadKey, now.toString());
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
