export const supportedLocales = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
];

export const defaultLocale = "en";

export function getLocaleFromPath(path: string): string {
  const segment = path.split("/")[1];
  const isSupported = supportedLocales.some((l) => l.code === segment);
  return isSupported ? segment : defaultLocale;
}
