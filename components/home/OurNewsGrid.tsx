"use client";
import Avatar from "boring-avatars";
import Image from "next/image";
import React from "react";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import { ArticleType } from "@/types/articles.types";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import AvatarAuthor from "../utility/AvatarAuthor";

const OurNewsGrid = ({
  data,
  locale,
  labels,
}: {
  data: ArticleType[];
  locale: string;
  labels: any;
}) => {
  console.log("Our News Grid data:", data.length);
  return (
    <div className="grid 3xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 *:lg:last:grid *:3xl:last:grid">
      {data.map((n) => {
        // Ambil hanya topic yang disetujui
        // const approvedTopics = Object.entries(n.topic || {})
        //   .filter(([_, value]: any) => value.status === "approved")
        //   .map(([key]) => key);

        return (
          <Link
            key={n.id}
            href={`/${locale}/article/${n.slug}`}
            className="no-underline"
          >
            <div className="flex flex-col h-auto cursor-pointer group transition-all duration-300">
              <div className="relative aspect-video">
                <Image
                  src={n.highlight_image} // Ganti dengan n.image_url saat tersedia
                  width={1920}
                  height={1080}
                  alt={n.en_title}
                  className="w-full aspect-video object-center object-cover rounded-2xl z-10"
                />
                <div className="flex flex-wrap gap-2 absolute bottom-5 left-5">
                  {n.category?.map((cat, i) => (
                    <p
                      key={cat.id}
                      className="bg-primary px-3 py-1 rounded-full text-white capitalize text-sm!"
                    >
                      {locale === routing.defaultLocale
                        ? cat.id_category
                        : cat.en_category}
                    </p>
                  ))}
                </div>
              </div>
              <div className="px-5 pb-5 pt-12 -mt-7 bg-background group-hover:bg-primary transition-all duration-300 rounded-2xl grow">
                <p className="text-sm! text-muted-foreground mb-2 group-hover:text-white/70 transition-all duration-300">
                  <LocalDateTime
                    date={n.created_at}
                    specificFormat="DD MMMM YYYY"
                  />
                </p>
                <h5 className="capitalize text-primary group-hover:text-white transition-all duration-300 font-bold line-clamp-2">
                  {locale === routing.defaultLocale ? n.id_title : n.en_title}
                </h5>
                <div
                  className="line-clamp-2 text-muted-foreground group-hover:text-white/50 transition-all duration-300 my-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      locale === routing.defaultLocale
                        ? n.id_content
                        : n.en_content,
                  }}
                />

                <div className="inline-flex gap-2 items-center mt-2">
                  <AvatarAuthor author={n.author[0]} locale={locale} asCard />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default OurNewsGrid;
