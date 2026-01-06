import { LanguageProvider } from "@/components/utility/lang/LanguageContext";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
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
          {" "}
          <NextTopLoader
            color="#3e77ab"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #3e77ab,0 0 5px #3e77ab"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          {children}
        </NextIntlClientProvider>
      </LanguageProvider>
    </>
  );
}
