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
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  short,
}: {
  className?: string;
  short?: boolean;
}) {
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
      <SelectTrigger
        className={cn(
          "border border-primary font-sans rounded-full bg-white relative z-9999 w-full h-12! px-5",
          className
        )}
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent
        className="border border-primary rounded-2xl font-sans z-9999 py-1 px-1"
        side="bottom"
      >
        {supportedLocales.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="rounded-2xl py-2"
          >
            <span
              className={`inline-flex items-center gap-2 ${
                short ? "uppercase" : "capitalize"
              }`}
            >
              <Image
                src={lang.code === "id" ? "/id.png" : "/en.png"}
                width={50}
                height={50}
                className="w-4 h-3"
                priority
                quality={50}
                alt={lang.code}
              />
              {short ? lang.code : lang.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
