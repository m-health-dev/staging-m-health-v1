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
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { ChatHistory } from "@/types/chat.types";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { WellnessType } from "@/types/wellness.types";
import { MedicalType } from "@/types/medical.types";
import { PackageType } from "@/types/packages.types";

const ChatSidebarShowreels = ({
  setOpenSheet,
  chatHistory,
  packages,
  medical,
  wellness,
  isLoading,
}: {
  setOpenSheet?: (value: boolean) => void;
  packages: PackageType[];
  medical: MedicalType[];
  wellness: WellnessType[];
  chatHistory: any[];
  isLoading: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Ambil path saat ini
  const router = useRouter();

  const locale = useLocale();

  console.log(chatHistory);

  return loading ? (
    <div className="flex w-full max-h-[calc(100vh-13.5vh)] min-h-[calc(100vh-13.5vh)] justify-center items-center">
      <Spinner className="text-primary" />
    </div>
  ) : (
    <div className="flex flex-col space-y-5">
      <div className="lg:bg-white shadow-sm bg-background p-4 rounded-2xl border border-primary sticky top-0">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="flex w-full items-center gap-2 text-primary cursor-pointer"
        >
          <Plus />{" "}
          <p className="font-bold">
            {locale === routing.defaultLocale ? "Obrolan Baru" : "New Chat"}
          </p>
        </button>
      </div>

      {/* <pre className="max-h-32 overflow-auto w-full text-wrap wrap-anywhere bg-white p-4 rounded-2xl">
        Chat History : {JSON.stringify(chatHistory, null, 2)}
      </pre> */}

      <div className="bg-white p-4 rounded-2xl border">
        <h4 className="font-extrabold text-primary">
          {locale === routing.defaultLocale
            ? "Riwayat Obrolan"
            : "Chat History"}
        </h4>
        <div className="space-y-5 pt-3">
          <div className="space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-full h-16" />
              </>
            ) : (
              <>
                {chatHistory.length > 0 ? (
                  chatHistory.map((s) => (
                    <Suspense key={s.id} fallback={<Spinner />}>
                      <button
                        key={s.id}
                        onClick={() => {
                          router.push(`/c/${s.id}`);
                          if (setOpenSheet) setOpenSheet(false);
                        }}
                        className="w-full text-left border border-border p-2 rounded-xl hover:bg-muted cursor-pointer"
                      >
                        <p className="font-semibold text-primary text-base! line-clamp-2 wrap-break-word">
                          {s.title}
                        </p>
                        <p className="text-xs! uppercase text-muted-foreground">
                          {s.id.slice(0, 8)}
                        </p>
                      </button>
                    </Suspense>
                  ))
                ) : (
                  <FailedGetDataNotice size="sm" />
                )}
                {chatHistory.length >= 1 && (
                  <div
                    onClick={() => {
                      localStorage.removeItem("mhealth_chat_sessions");
                      if (setOpenSheet) setOpenSheet(false);
                      router.refresh();
                    }}
                    className="text-xs text-red-500 hover:text-red-700 inline-flex gap-1 items-center mt-2 transition cursor-pointer"
                  >
                    <Trash2 className="size-3" />{" "}
                    {locale === routing.defaultLocale
                      ? "Hapus riwayat percakapan"
                      : "Clear chat history"}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border">
        <h4 className="font-extrabold text-primary mb-3">
          {locale === routing.defaultLocale ? "Program" : "Programs"}
        </h4>
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
        <h4 className="font-extrabold text-primary mb-3">
          {locale === routing.defaultLocale ? "Kebugaran" : "Wellness"}
        </h4>
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
        <h4 className="font-extrabold text-primary mb-3">
          {locale === routing.defaultLocale ? "Medis" : "Medical"}
        </h4>
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
