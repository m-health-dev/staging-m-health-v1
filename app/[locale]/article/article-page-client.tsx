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
import ArticleCard from "@/components/article/article-card";
import SearchArea from "@/components/utility/SearchArea";

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
  const [loading, setLoading] = React.useState(true);
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
      <div className="grid 3xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 *:3xl:last:grid">
        {articles.map((n) => {
          return <ArticleCard n={n} locale={locale} key={n.id} />;
        })}
      </div>
      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
      <SearchArea target="articles" />
    </div>
  );
};

export default ArticlePageClient;
