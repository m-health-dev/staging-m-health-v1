import { LanguageProvider } from "@/components/utility/lang/LanguageContext";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
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
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </LanguageProvider>
    </>
  );
}
