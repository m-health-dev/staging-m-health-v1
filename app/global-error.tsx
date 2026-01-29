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
import { Suspense } from "react";
import LoadingComponent from "@/components/utility/loading-component";

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
  title: "M HEALTH - v1.0.0-beta.8",
  description:
    "M HEALTH adalah platform kesehatan digital yang dirancang untuk membantu Anda mendapatkan informasi medis yang cepat, akurat, dan terpercaya. Kami memahami bahwa mencari solusi kesehatan sering kali terasa membingungkan. Oleh karena itu, kami hadir sebagai 'digital front door' — pintu gerbang kesehatan yang memudahkan siapa pun untuk bertanya, berkonsultasi, serta merencanakan perjalanan medis dan wellness secara sederhana, transparan, dan terjangkau.",
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
        <Suspense fallback={<LoadingComponent />}>
          <ErrorContent
            digest={error.digest}
            message={error.message}
            onRetry={reset}
          />
        </Suspense>
      </body>
    </html>
  );
}
