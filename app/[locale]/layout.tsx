import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/utility/lang/LanguageContext";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M-Health",
  description: "Kesehatanmu Bahagiaku.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const buildId = process.env.VERCEL_GIT_COMMIT_SHA;
const deployId = process.env.VERCEL_DEPLOYMENT_ID;

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </LanguageProvider>
        <div className="fixed left-0 bottom-5 w-full">
          <div className="flex justify-center items-center">
            <div className="flex justify-center w-fit items-center rounded-full bg-white shadow-sm">
              <Image
                src={"/vyg.png"}
                alt="vyg.re"
                width={50}
                height={10}
                className="rounded-full"
              />
              <p className="text-xs! text-muted-foreground uppercase py-1 px-3">
                {buildId?.slice(0, 7) || "Local Build"} -{" "}
                {deployId?.split("_")[1].slice(0, 7) || "Local Deploy"}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
