import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Manrope,
} from "next/font/google";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/utility/lang/LanguageContext";
import Image from "next/image";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";
import OneTapComponent from "@/components/utility/GoogleOneTap";

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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${manrope.variable} ${vietnamPro.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <NextTopLoader
              color="#3e77ab"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px #3e77ab,0 0 5px #3e77ab"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />
            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                classNames: {
                  title: "font-sans text-base font-semibold!",
                  description: "font-content",
                  toast: "rounded-2xl! min-h-16",
                },
              }}
            />
            <Analytics />
            <SpeedInsights />
            {children}
            {/* <div
              id="g_id_onload"
              data-client_id="92675309192-qvkkf9g7f42pbv83su4ubvojvsk4qavi.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-callback="https://hoocfkzapbmnldwmedrq.supabase.co/auth/v1/callback"
              data-auto_select="true"
              data-itp_support="true"
              data-use_fedcm_for_prompt="true"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-locale="id"
              data-logo_alignment="left"
            ></div> */}
            <OneTapComponent />
          </NextIntlClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
