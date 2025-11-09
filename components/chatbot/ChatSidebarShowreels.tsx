"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import {
  get5ImageEvents,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { Trash2 } from "lucide-react";

const ChatSidebarShowreels = ({
  onSelectChat,
  setOpenSheet,
}: {
  onSelectChat: (id: string) => void;
  setOpenSheet?: (value: boolean) => void;
}) => {
  const [imageWellness, setImageWellness] = useState<any[]>([]);
  const [imageMedical, setImageMedical] = useState<any[]>([]);
  const [imageEvents, setImageEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const imageData = async () => {
      setLoading(true);
      try {
        const resWel = await get5ImageWellness();

        if (!resWel) throw new Error("Failed to Fetch 5 Images Wellness");
        setImageWellness(resWel.results);

        const resMed = await get5ImageMedical();

        if (!resMed) throw new Error("Failed to Fetch 5 Images Medical");
        setImageMedical(resMed.results);

        const resEv = await get5ImageEvents();

        if (!resEv) throw new Error("Failed to Fetch 5 Images Events");
        setImageEvents(resEv.results);
        setLoading(false);
      } catch (error: any) {
        if (error) {
          throw new Error("Undefined Error!");
        }
        setLoading(false);
      }
    };

    imageData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("mhealth_chat_sessions");
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    }, 1000); // cek setiap 1 detik

    return () => clearInterval(interval);
  }, []);

  return loading ? (
    <div className="flex w-full max-h-[calc(100vh-13.5vh)] min-h-[calc(100vh-13.5vh)] justify-center items-center">
      <Spinner className="text-primary" />
    </div>
  ) : (
    <div className="flex flex-col">
      <h4 className="font-bold text-primary sticky top-0 bg-white py-5 border-b border-border mb-5">
        Riwayat Obrolan
      </h4>
      <div className="space-y-5 py-3">
        <div className="space-y-2">
          {sessions.length > 0 ? (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectChat(s.id);
                  if (setOpenSheet) setOpenSheet(false);
                }}
                className="w-full text-left border border-border p-2 rounded-xl"
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
            <p className="bg-muted py-5 px-3 rounded-2xl text-muted-foreground text-sm!">
              Belum ada obrolan.
            </p>
          )}
          {sessions.length >= 1 && (
            <div
              onClick={() => {
                localStorage.removeItem("mhealth_chat_sessions");
                if (setOpenSheet) setOpenSheet(false);
                window.location.reload();
              }}
              className="text-xs text-red-500 hover:text-red-700 inline-flex gap-1 items-center mt-2 transition"
            >
              <Trash2 className="size-3" /> Hapus riwayat percakapan
            </div>
          )}
        </div>
      </div>
      <h4 className="font-bold text-primary sticky top-0 bg-white py-5 border-b border-border mb-5">
        Welness
      </h4>
      <div className="space-y-5">
        {imageWellness.map((img, i) => (
          <Link
            key={img.id}
            href={`/wellness/package-${i + 1}`}
            className="group"
          >
            <div className="grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3 border border-border mb-5">
              <div className="col-span-1 px-3">
                <Suspense fallback={<Spinner />}>
                  <Image
                    src={img.full}
                    alt={img.alt}
                    width={720}
                    height={720}
                    className="aspect-square object-cover object-center rounded-xl"
                  />
                </Suspense>
              </div>
              <div className="col-span-2">
                <h6 className="font-bold text-primary line-clamp-3 ">
                  Package item {i + 1} by. {i + 5 * 3} Hospital in Bali
                </h6>
              </div>
              <div className="col-span-3 mt-2 px-3">
                <p className="text-sm! text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Suscipit tenetur cum vel, adipisci provident, voluptas magnam
                  veniam saepe ut ipsum aut veritatis voluptatum quisquam
                  pariatur vero consequatur? Possimus, fugiat minima?
                </p>
              </div>
            </div>
          </Link>
        ))}
        {imageWellness.length <= 0 && (
          <p className="bg-muted py-5 px-3 rounded-2xl text-muted-foreground text-sm!">
            Belum ada data.
          </p>
        )}
      </div>
      <h4 className="font-bold text-primary sticky top-0 bg-white py-5 border-b border-border mb-5">
        Medical
      </h4>
      <div className="space-y-5">
        {imageMedical.map((img, i) => (
          <Link
            key={img.id}
            href={`/wellness/package-${i + 1}`}
            className="group"
          >
            <div className="grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3  border border-border mb-5">
              <div className="col-span-1 px-3">
                <Image
                  src={img.full}
                  alt={img.alt}
                  width={720}
                  height={720}
                  className="aspect-square object-cover object-center rounded-xl"
                />
              </div>
              <div className="col-span-2">
                <h6 className="font-bold text-primary line-clamp-3 ">
                  Package item {i + 1} by. {i + 5 * 3} Hospital in Bali
                </h6>
              </div>
              <div className="col-span-3 mt-2 px-3">
                <p className="text-sm! text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Suscipit tenetur cum vel, adipisci provident, voluptas magnam
                  veniam saepe ut ipsum aut veritatis voluptatum quisquam
                  pariatur vero consequatur? Possimus, fugiat minima?
                </p>
              </div>
            </div>
          </Link>
        ))}
        {imageWellness.length <= 0 && (
          <p className="bg-muted py-5 px-3 rounded-2xl text-muted-foreground text-sm!">
            Belum ada data.
          </p>
        )}
      </div>
      <h4 className="font-bold text-primary sticky top-0 bg-white py-5 border-b border-border mb-5">
        Events
      </h4>
      <div className="space-y-5">
        {imageEvents.map((img, i) => (
          <Link
            key={img.id}
            href={`/wellness/package-${i + 1}`}
            className="group"
          >
            <div className="grid grid-cols-3 items-center group-hover:bg-muted group-hover:shadow-sm transition-all duration-300 rounded-xl py-3  border border-border mb-5">
              <div className="col-span-1 px-3">
                <Image
                  src={img.full}
                  alt={img.alt}
                  width={720}
                  height={720}
                  className="aspect-square object-cover object-center rounded-xl"
                />
              </div>
              <div className="col-span-2">
                <h6 className="font-bold text-primary line-clamp-3 ">
                  Package item {i + 1} by. {i + 5 * 3} Hospital in Bali
                </h6>
              </div>
              <div className="col-span-3 mt-2 px-3">
                <p className="text-sm! text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Suscipit tenetur cum vel, adipisci provident, voluptas magnam
                  veniam saepe ut ipsum aut veritatis voluptatum quisquam
                  pariatur vero consequatur? Possimus, fugiat minima?
                </p>
              </div>
            </div>
          </Link>
        ))}
        {imageEvents.length <= 0 && (
          <p className="bg-muted py-5 px-3 rounded-2xl text-muted-foreground text-sm!">
            Belum ada data.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebarShowreels;
