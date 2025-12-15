"use client"; // Error boundaries must be Client Components

import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Manrope,
} from "next/font/google";
import "./globals.css";
import NotFoundContent from "@/components/utility/NotFoundContent";
import ErrorContent from "@/components/utility/ErrorContent";

const manrope = Manrope({
  variable: "--font-manrope-sans",
  subsets: ["latin"],
});

const vietnamPro = Be_Vietnam_Pro({
  variable: "--font-content",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M-Health",
  description: "Kesehatanmu Bahagiaku.",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${vietnamPro.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorContent
          digest={error.digest}
          message={error.message}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
