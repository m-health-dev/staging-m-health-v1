"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { Suspense, useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageContext";
import { usePathname } from "next/navigation";
import LoadingComponent from "../loading-component";

const DialogSwitchLang = () => {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Cek apakah user sudah pernah mengatur preferensi bahasa
    const hasPreferredLanguage = localStorage.getItem(
      "mhealth_preferred_language",
    );

    // Jika belum ada preferensi bahasa, tampilkan dialog
    if (!hasPreferredLanguage) {
      setIsOpen(true);
    }
  }, []);

  // Ketika user memilih "No", set bahasa saat ini sebagai preferensi
  const handleKeepCurrentLanguage = () => {
    localStorage.setItem("mhealth_preferred_language", locale);
    setIsOpen(false);
  };

  // Monitor perubahan locale dari LanguageSwitcher
  useEffect(() => {
    if (mounted) {
      // Simpan bahasa yang dipilih sebagai preferensi
      const hasPreferredLanguage = localStorage.getItem(
        "mhealth_preferred_language",
      );
      if (hasPreferredLanguage) {
        localStorage.setItem("mhealth_preferred_language", locale);
      }
    }
  }, [locale, mounted]);

  // Jangan render sampai component mounted (avoid hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white">
        <DialogHeader className="hidden" />
        <h5 className="text-primary font-bold">
          {locale === routing.defaultLocale
            ? "Apakah anda ingin mengubah preferensi bahasa?"
            : "Do you want to change your language preference?"}
        </h5>
        <p>
          {locale === routing.defaultLocale
            ? "Bahasa saat ini"
            : "Current Language"}{" "}
          : {locale === "en" ? "English" : "Indonesia"}
        </p>
        <div className="flex lg:flex-row flex-col w-full justify-end gap-4">
          <Button
            className="h-12 rounded-full lg:w-fit w-full"
            onClick={handleKeepCurrentLanguage}
          >
            {locale === routing.defaultLocale ? "Tidak" : "No"}
          </Button>
          <Suspense fallback={<LoadingComponent />}>
            <LanguageSwitcher
              className="lg:w-fit w-full"
              onLanguageChange={() => setIsOpen(false)}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSwitchLang;
