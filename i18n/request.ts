import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      about: (await import(`@/messages/${locale}/about.json`)).default,
      cta: (await import(`@/messages/${locale}/cta.json`)).default,
      utility: (await import(`@/messages/${locale}/utility.json`)).default,
      ComingSoon: (await import(`@/messages/${locale}/ComingSoon.json`))
        .default,
      consult: (await import(`@/messages/${locale}/consult.json`)).default,
      FailedNotice: (await import(`@/messages/${locale}/FailedNotice.json`))
        .default,
    },
  };
});
