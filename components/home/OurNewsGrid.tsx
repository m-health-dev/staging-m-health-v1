"use client";
import Avatar from "boring-avatars";
import Image from "next/image";
import React from "react";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import { ArticleType } from "@/types/articles.types";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import AvatarAuthor from "../utility/AvatarAuthor";
import ArticleCard from "../article/article-card";
import ContainerWrap from "../utility/ContainerWrap";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";

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

  if (!Array.isArray(data) || data.length <= 0) {
    return <FailedGetDataNotice />;
  }
  return (
    <div className="grid 3xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 *:lg:last:grid *:3xl:last:grid">
      {data.map((n) => {
        return <ArticleCard n={n} locale={locale} key={n.id} onHome />;
      })}
    </div>
  );
};

export default OurNewsGrid;
