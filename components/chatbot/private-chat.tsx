import { routing } from "@/i18n/routing";
import { EyeOff } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";

const PrivateChat = () => {
  const locale = useLocale();
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col lg:items-center items-start">
        <div className="bg-white w-10 h-10 rounded-full aspect-square border border-primary flex items-center justify-center">
          <EyeOff className="text-primary size-5" />
        </div>
        <div className="mt-3">
          <h5 className="font-semibold text-primary lg:text-center text-start">
            {locale === routing.defaultLocale
              ? "Anda Tidak Memiliki Akses untuk Melihat Percakapan"
              : "You Don't Have Access to View this Conversations"}
          </h5>
          <p className="text-muted-foreground mt-2 lg:text-center text-start">
            {locale === routing.defaultLocale ? (
              <span>
                Hubungi pemilik percakapan atau{" "}
                <Link href={`/sign-in`} className="text-primary">
                  masuk
                </Link>{" "}
                untuk mengakses percakapan.
              </span>
            ) : (
              <span>
                Contact the conversation owner or{" "}
                <Link href={`/sign-in`} className="text-primary">
                  log in
                </Link>{" "}
                to access the conversation.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
