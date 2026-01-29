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
import SnowFall from "@/components/snow-fall";
import { SidebarProvider } from "@/components/ui/sidebar";
import DialogSwitchLang from "@/components/utility/lang/DialogSwitchLang";
import PageTransition from "@/components/utility/PageTransition";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import ScrollToTop from "@/components/utility/ScrollToTop";
import Script from "next/script";
import UserwayRouteControl from "@/components/utility/UserWayRouteControl";

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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // const nonce = (await headers()).get("x-nonce") || undefined;
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${manrope.variable} ${vietnamPro.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <NextTopLoader
              color="#30b878"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #30b878,0 0 5px #30b878"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />

            {/* UserWay Accessibility Widget */}
            <Script
              src="https://cdn.userway.org/widget.js"
              strategy="afterInteractive"
              data-account="wjUwooWFlF"
              data-language={locale}
              data-color="#3e77ab"
              data-z-index="10001"
              data-widget_layout="full"
              data-position="5"
              // nonce={nonce}
            />

            <UserwayRouteControl />

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
            <GoogleAnalytics gaId="G-P8LGDRYY19" />
            <Analytics />
            <SpeedInsights />
            <ScrollToTop />
            <DialogSwitchLang />
            {children}

            <OneTapComponent />
          </NextIntlClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
