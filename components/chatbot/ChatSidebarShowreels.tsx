"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import {
  get10ImageEvents,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { getImagePicsum } from "@/lib/picsumPhotos";
import { Package } from "@/types/packages.types";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Medical } from "@/types/medical.types";
import { Wellness } from "@/types/wellness.types";

const ChatSidebarShowreels = ({
  onSelectChat,
  setOpenSheet,
  packages,
  medical,
  wellness,
}: {
  onSelectChat: (id: string) => void;
  setOpenSheet?: (value: boolean) => void;
  packages: Package[];
  medical: Medical[];
  wellness: Wellness[];
}) => {
  const [imageWellness, setImageWellness] = useState<any[]>([]);
  const [imageMedical, setImageMedical] = useState<any[]>([]);
  const [imageEvents, setImageEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  const locale = useLocale();

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("mhealth_chat_sessions");
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    }, 1000); // cek setiap 1 detik

    return () => clearInterval(interval);
  }, []);

  const startNewChat = () => {
    const newId = nanoid();
    localStorage.setItem("mhealth_active_chat_id", newId);
  };

  return loading ? (
    <div className="flex w-full max-h-[calc(100vh-13.5vh)] min-h-[calc(100vh-13.5vh)] justify-center items-center">
      <Spinner className="text-primary" />
    </div>
  ) : (
    <div className="flex flex-col space-y-5">
      <div className="lg:bg-white shadow-sm bg-background p-4 rounded-2xl border border-primary sticky top-0">
        <button
          onClick={() => {
            startNewChat(), window.location.reload();
          }}
          className="flex w-full items-center gap-2 text-primary cursor-pointer"
        >
          <Plus /> <p className="font-bold">Obrolan Baru</p>
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border">
          <h4 className="font-extrabold text-primary">Riwayat Obrolan</h4>
          <div className="space-y-5 pt-3">
            <div className="space-y-2">
              {sessions.length > 0 ? (
                sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectChat(s.id);
                      if (setOpenSheet) setOpenSheet(false);
                    }}
                    className="w-full text-left border border-border p-2 rounded-xl hover:bg-muted cursor-pointer"
                  >
                    <p className="font-medium text-primary text-base! line-clamp-2 wrap-break-word">
                      {s.title}
                    </p>
                    <p className="text-xs! uppercase text-muted-foreground">
                      {s.id.slice(0, 7)}
                    </p>
                    <div className="text-xs text-muted-foreground truncate">
                      {s.messages?.[s.messages.length - 1]?.content}
                    </div>
                  </button>
                ))
              ) : (
                <FailedGetDataNotice size="sm" />
              )}
              {sessions.length >= 1 && (
                <div
                  onClick={() => {
                    localStorage.removeItem("mhealth_chat_sessions");
                    if (setOpenSheet) setOpenSheet(false);
                    window.location.reload();
                  }}
                  className="text-xs text-red-500 hover:text-red-700 inline-flex gap-1 items-center mt-2 transition cursor-pointer"
                >
                  <Trash2 className="size-3" /> Hapus riwayat percakapan
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border">
        <h4 className="font-extrabold text-primary mb-3">Packages</h4>
        <div className="space-y-5">
          {packages.map((img, i) => (
            <Link
              key={img.id}
              href={`/wellness/package-${i + 1}`}
              className="group"
            >
              <div
                className={`grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3 border border-border ${
                  i + 1 === packages.length ? "mb-0" : "mb-4"
                }`}
              >
                <div className="px-3 col-span-1">
                  <Suspense fallback={<Spinner />}>
                    <Image
                      src={"https://placehold.co/720x720.png"}
                      alt={"https://placehold.co/720x720.png"}
                      width={720}
                      height={720}
                      className="aspect-square object-cover object-center rounded-xl"
                    />
                  </Suspense>
                </div>
                <div className="col-span-2 pr-3">
                  <div className="">
                    <p className="font-extrabold text-primary line-clamp-2 ">
                      {locale === routing.defaultLocale
                        ? img.id_title
                        : img.en_title}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm! text-muted-foreground line-clamp-2">
                      {locale === routing.defaultLocale
                        ? img.id_tagline
                        : img.en_tagline}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {packages.length <= 0 && <FailedGetDataNotice size="sm" />}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border">
        <h4 className="font-extrabold text-primary mb-3">Welness</h4>
        <div className="space-y-5">
          {wellness.map((img, i) => (
            <Link
              key={img.id}
              href={`/wellness/package-${i + 1}`}
              className="group"
            >
              <div
                className={`grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3 border border-border ${
                  i + 1 === wellness.length ? "mb-0" : "mb-4"
                }`}
              >
                <div className="px-3 col-span-1">
                  <Suspense fallback={<Spinner />}>
                    <Image
                      src={"https://placehold.co/720x720.png"}
                      alt={"https://placehold.co/720x720.png"}
                      width={720}
                      height={720}
                      className="aspect-square object-cover object-center rounded-xl"
                    />
                  </Suspense>
                </div>
                <div className="col-span-2 pr-3">
                  <div className="">
                    <p className="font-extrabold text-primary line-clamp-2 ">
                      {locale === routing.defaultLocale
                        ? img.id_title
                        : img.en_title}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm! text-muted-foreground line-clamp-2">
                      {locale === routing.defaultLocale
                        ? img.id_tagline
                        : img.en_tagline}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {wellness.length <= 0 && <FailedGetDataNotice size="sm" />}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border">
        <h4 className="font-extrabold text-primary mb-3">Medical</h4>
        <div className="space-y-5">
          {medical.map((img, i) => (
            <Link
              key={img.id}
              href={`/wellness/package-${i + 1}`}
              className="group"
            >
              <div
                className={`grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3 border border-border ${
                  i + 1 === medical.length ? "mb-0" : "mb-4"
                }`}
              >
                <div className="px-3 col-span-1">
                  <Suspense fallback={<Spinner />}>
                    <Image
                      src={"https://placehold.co/720x720.png"}
                      alt={"https://placehold.co/720x720.png"}
                      width={720}
                      height={720}
                      className="aspect-square object-cover object-center rounded-xl"
                    />
                  </Suspense>
                </div>
                <div className="col-span-2 pr-3">
                  <div className="">
                    <p className="font-extrabold text-primary line-clamp-2 ">
                      {locale === routing.defaultLocale
                        ? img.id_title
                        : img.en_title}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm! text-muted-foreground line-clamp-2">
                      {locale === routing.defaultLocale
                        ? img.id_tagline
                        : img.en_tagline}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {medical.length <= 0 && <FailedGetDataNotice size="sm" />}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebarShowreels;
