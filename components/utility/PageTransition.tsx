"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

type TransitionPhase = "idle" | "cover" | "hold" | "reveal";

/**
 * PageTransition - Circle wipe page transition (bottom ↑ bottom)
 *
 * 1. User clicks a link → intercept BEFORE navigation, circle grows from bottom center
 * 2. Circle covers the screen with a loading spinner → then navigate to new page
 * 3. New page content arrives → circle shrinks back toward bottom center, revealing new page
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [displayChildren, setDisplayChildren] = useState(children);
  const pendingHref = useRef<string | null>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathnameAtHoldStart = useRef<string>(pathname);
  const childrenUpdatedDuringHold = useRef(false);

  // Keep displayChildren in sync when idle
  useEffect(() => {
    if (phase === "idle") {
      setDisplayChildren(children);
    }
  }, [children, phase]);

  // Intercept all <a> clicks BEFORE Next.js navigates
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Already transitioning — ignore
      if (pendingHref.current || phase !== "idle") return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip: external, hash, mailto, tel, download, new-tab, modifier keys
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      )
        return;

      // Skip if same page
      if (href === pathname) return;

      // Stop default navigation
      e.preventDefault();
      e.stopPropagation();

      // Store destination and start cover animation
      pendingHref.current = href;
      setPhase("cover");
    };

    // Capture phase so we fire before Next.js <Link> handlers
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, phase]);

  // Cover animation finished → save current pathname, navigate, then hold
  const handleCoverComplete = useCallback(() => {
    if (phase === "cover" && pendingHref.current) {
      pathnameAtHoldStart.current = pathname;
      childrenUpdatedDuringHold.current = false;
      router.push(pendingHref.current);
      pendingHref.current = null;
      setPhase("hold");
    }
  }, [phase, router, pathname]);

  // During "hold", detect when pathname actually changes (new page arrived)
  useEffect(() => {
    if (phase !== "hold") return;
    // Only proceed if pathname is DIFFERENT from when hold started
    if (pathname === pathnameAtHoldStart.current) return;

    // Pathname changed — new page is loading, wait for children to also update
    childrenUpdatedDuringHold.current = true;
    setDisplayChildren(children);
    const timer = setTimeout(() => setPhase("reveal"), 200);
    return () => clearTimeout(timer);
  }, [pathname, phase]);

  // Also watch children changes during hold — if pathname already changed, reveal
  useEffect(() => {
    if (phase !== "hold") return;
    if (pathname === pathnameAtHoldStart.current) return;

    // Both pathname and children have updated — safe to reveal
    setDisplayChildren(children);
    if (!childrenUpdatedDuringHold.current) {
      childrenUpdatedDuringHold.current = true;
      const timer = setTimeout(() => setPhase("reveal"), 200);
      return () => clearTimeout(timer);
    }
  }, [children, phase, pathname]);

  // Safety timeout: if page takes too long during hold, reveal anyway
  useEffect(() => {
    if (phase === "hold") {
      holdTimeoutRef.current = setTimeout(() => {
        setDisplayChildren(children);
        setPhase("reveal");
      }, 5000);
      return () => {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      };
    }
  }, [phase]);

  // Reveal animation finished → back to idle
  const handleRevealComplete = useCallback(() => {
    if (phase === "reveal") {
      setPhase("idle");
    }
  }, [phase]);

  const isActive = phase !== "idle";

  return (
    <>
      {displayChildren}

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="circle-transition"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              pointerEvents: phase === "hold" ? "auto" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            initial={{
              clipPath: "circle(0% at 50% 100%)",
            }}
            animate={
              phase === "cover" || phase === "hold"
                ? { clipPath: "circle(150% at 50% 50%)" }
                : phase === "reveal"
                  ? { clipPath: "circle(0% at 50% 100%)" }
                  : undefined
            }
            exit={{
              clipPath: "circle(0% at 50% 100%)",
            }}
            transition={{
              duration: phase === "reveal" ? 1.2 : 1.2,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="bg-primary/10 backdrop-blur-lg"
            onAnimationComplete={() => {
              if (phase === "cover") handleCoverComplete();
              if (phase === "reveal") handleRevealComplete();
            }}
          >
            {/* Loading indicator */}
            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {/* Spinning ring */}
              {/* <motion.div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.15)",
                  borderTopColor: "#3e77ab",
                  boxSizing: "border-box",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              /> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageTransition;
