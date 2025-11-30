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
