"use client";

import { EventsType } from "@/types/events.types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ArrowUpRight, Calendar, MapPin, PencilLine } from "lucide-react";
import React from "react";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { Button } from "@/components/ui/button";
import SimplePagination from "@/components/utility/simple-pagination";
import { ArticleType } from "@/types/articles.types";
import Avatar from "boring-avatars";
import AvatarAuthor from "@/components/utility/AvatarAuthor";

const ArticlePageClient = ({
  articles,
  locale,
  labels,
  meta,
  links,
}: {
  articles: ArticleType[];
  locale: string;
  labels: any;
  meta: any;
  links: any;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const router = useRouter();

  console.log({ articles });
  return (
    <div className="mb-[10vh]">
      {articles.length === 0 && (
        <p className="text-center text-muted-foreground my-10">
          {locale === routing.defaultLocale
            ? "Tidak ada artikel."
            : "No articles available."}
        </p>
      )}
      <div className="grid 3xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 *:lg:last:hidden *:3xl:last:grid">
        {articles.map((n) => {
          return (
            <Link
              key={n.id}
              href={`/${locale}/article/${n.slug}`}
              className="no-underline"
            >
              <div
                key={n.id}
                className="flex flex-col h-auto cursor-pointer group transition-all duration-300 bg-white rounded-2xl"
              >
                <div className="relative aspect-video">
                  <Image
                    src={
                      n.highlight_image ||
                      "https://placehold.co/720x403.png?text=M+HEALTH+DEVELOPMENT"
                    } // Ganti dengan n.image_url saat tersedia
                    width={720}
                    height={403}
                    alt={n.en_title}
                    className="w-full aspect-video object-center object-cover rounded-2xl z-10"
                  />

                  <div className="flex flex-wrap gap-2 absolute bottom-5 left-5">
                    {n.category?.map((cat, i) => (
                      <p
                        key={i}
                        className="bg-primary px-3 py-1 rounded-full text-white capitalize text-sm!"
                      >
                        {locale === routing.defaultLocale
                          ? cat.id_category
                          : cat.en_category}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="px-5 pb-5 pt-12 -mt-7 group-hover:bg-primary transition-all duration-300 rounded-2xl grow">
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
      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
    </div>
  );
};

export default ArticlePageClient;
