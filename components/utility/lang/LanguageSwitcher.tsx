"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supportedLocales, getLocaleFromPath } from "@/lib/locales";
import { useLanguage } from "./LanguageContext";
import Image from "next/image";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  // Pastikan komponen hanya render setelah mount
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!pathname) return;
    const pathLocale = getLocaleFromPath(pathname);
    if (pathLocale !== locale) setLocale(pathLocale);
  }, [pathname]);

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setLocale(newLocale);

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  if (!mounted) return null;

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="border border-primary font-sans">
        <SelectValue placeholder="Language" className=" h-24" />
      </SelectTrigger>
      <SelectContent className="border border-primary font-sans" side="right">
        {supportedLocales.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="inline-flex items-center gap-2 uppercase">
              <Image
                src={lang.code === "id" ? "/id.png" : "/en.png"}
                width={50}
                height={50}
                className="w-4 h-3"
                priority
                quality={50}
                alt={lang.code}
              />
              {lang.code}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
