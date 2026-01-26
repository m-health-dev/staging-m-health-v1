"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { routing } from "@/i18n/routing";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

// Client component for redirect with loading UI
export const WhatsAppRedirect = ({
  waUrl,
  locale,
}: {
  waUrl: string;
  locale: string;
}) => {
  React.useEffect(() => {
    window.location.href = waUrl;
  }, [waUrl]);
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <Spinner className="mb-4 text-health size-6" />
      <p className="text-lg text-primary font-semibold mb-2">
        {locale === "id"
          ? "Mengalihkan ke WhatsApp..."
          : "Redirecting to WhatsApp..."}
      </p>
      <p className="text-muted-foreground text-sm">
        {locale === "id"
          ? "Jika pengalihan tidak terjadi, silakan klik tautan berikut."
          : "If the redirection does not occur, please click the following link."}{" "}
      </p>
      <Link
        href={waUrl}
        className="mt-5"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="rounded-full  w-full bg-health text-white hover:bg-health/90 h-10 px-5!">
          <FontAwesomeIcon icon={faWhatsapp} className="size-5" />

          {locale === routing.defaultLocale ? "Buka WhatsApp" : "Open WhatsApp"}
        </Button>
      </Link>
    </div>
  );
};
