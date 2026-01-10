"use client";

import Image from "next/image";
import Avatar from "boring-avatars";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getArticleAuthorByID } from "@/lib/article-author/get-article-author";

const authorCache: Record<string, any> = {};

const AvatarAuthor = ({
  author,
  size = "sm",
  locale,
  asCard,
}: {
  author?: any;
  size?: "sm" | "md" | "lg";
  locale: string;
  asCard?: boolean;
}) => {
  const authorImage = author?.profile_image;
  const authorName = author?.name;
  const authorJobdesc = author?.jobdesc;

  // console.log("author avatar author:", author);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useRouter();

  return authorImage ? (
    <div>
      <button
        // onClick={() => router.push(`/${locale}/${type}/${data.slug}`)}
        className="cursor-pointer"
      >
        <div className="inline-flex gap-2 items-center">
          <div className="relative">
            <Skeleton
              className={cn(
                "absolute inset-0 z-10 rounded-full flex w-full justify-center items-center transition-all duration-500",
                !avatarLoading ? "hidden" : "block"
              )}
            />
            <Image
              src={
                imageError
                  ? "https://placehold.co/80x80/png?text=No+Image"
                  : authorImage
              }
              alt={authorName || "author-profile-image"}
              width={80}
              height={80}
              className={cn(
                "object-cover  rounded-full border",
                size === "sm" && "w-7 h-7",
                size === "md" && "w-10 h-10",
                size === "lg" && "w-14 h-14"
              )}
              onLoad={() => setAvatarLoading(false)}
              onError={() => setImageError(true)}
            />
          </div>
          <p
            className={cn(
              " text-health normal-case line-clamp-1",
              size === "sm" && "text-xs!",
              size === "md" && "text-sm!",
              size === "lg" && "text-base!"
            )}
          >
            {authorName}
          </p>
        </div>
      </button>
    </div>
  ) : (
    <div className="inline-flex gap-2 items-center">
      <Avatar
        name={authorName ?? author ?? "Unknown"}
        className={cn(
          "border rounded-full",
          size === "sm" && "w-7 h-7",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-14 h-14"
        )}
        colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
        variant="beam"
        size={80}
      />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div>
        <p
          className={cn(
            " text-health normal-case line-clamp-1",
            size === "sm" && "text-xs!",
            size === "md" && "text-sm!",
            size === "lg" && "text-base!"
          )}
        >
          {authorName ?? "Unknown"}
        </p>
        <p
          className={cn(
            "text-muted-foreground normal-case line-clamp-1 text-xs! italic",
            asCard && "hidden"
          )}
        >
          {authorJobdesc ?? ""}
        </p>
      </div>
    </div>
  );
};

export default AvatarAuthor;
