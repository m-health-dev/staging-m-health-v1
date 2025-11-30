import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Manrope,
} from "next/font/google";
import "../../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/utility/lang/LanguageContext";
import Image from "next/image";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <>
      <LanguageProvider>
        <NextIntlClientProvider>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              classNames: {
                title: "font-sans text-base font-semibold!",
                description: "font-content",
                toast: "lg:min-w-lg rounded-2xl! min-h-16",
              },
            }}
          />
          {children}
        </NextIntlClientProvider>
      </LanguageProvider>
    </>
  );
}
