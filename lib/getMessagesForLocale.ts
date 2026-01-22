import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";

/**
 * Load messages directly for a given locale without accessing runtime data.
 * This enables static generation and avoids the "Runtime data was accessed outside of <Suspense>" error.
 */
export async function getMessagesForLocale(requestedLocale: string) {
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    about: (await import(`@/messages/${locale}/about.json`)).default,
    cta: (await import(`@/messages/${locale}/cta.json`)).default,
    utility: (await import(`@/messages/${locale}/utility.json`)).default,
    ComingSoon: (await import(`@/messages/${locale}/ComingSoon.json`)).default,
    consult: (await import(`@/messages/${locale}/consult.json`)).default,
    FailedNotice: (await import(`@/messages/${locale}/FailedNotice.json`))
      .default,
  };
}
