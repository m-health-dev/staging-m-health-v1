import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Manrope,
} from "next/font/google";
import "../globals.css";
import Image from "next/image";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Toaster } from "sonner";
import NotFoundContent from "@/components/utility/NotFoundContent";

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

export default async function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${vietnamPro.variable} ${geistMono.variable} antialiased`}
      >
        <NotFoundContent />
      </body>
    </html>
  );
}
