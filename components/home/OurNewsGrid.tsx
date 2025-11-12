"use client";
import Avatar from "boring-avatars";
import Image from "next/image";
import React from "react";
import LocalDateTime from "../utility/lang/LocaleDateTime";

const OurNewsGrid = ({ data }: { data: any[] }) => {
  return (
    <div className="grid 3xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 *:lg:last:hidden *:3xl:last:grid">
      {data.map((n) => {
        // Ambil hanya topic yang disetujui
        const approvedTopics = Object.entries(n.topic || {})
          .filter(([_, value]: any) => value.status === "approved")
          .map(([key]) => key);

        return (
          <div
            key={n.id}
            className="flex flex-col h-auto cursor-pointer group transition-all duration-300"
          >
            <div className="relative aspect-video">
              <Image
                src={n.full}
                width={720}
                height={403}
                alt={n.alt}
                className="w-full aspect-video object-center object-cover rounded-2xl z-10"
              />
              <div className="flex flex-wrap gap-2 absolute bottom-5 left-5">
                {approvedTopics.length >= 1 ? (
                  approvedTopics.map((t) => (
                    <p
                      key={t}
                      className="text-xs! bg-background text-primary border border-primary px-3 py-1 rounded-full capitalize"
                    >
                      {t.replaceAll("-", " ") || "Article"}
                    </p>
                  ))
                ) : (
                  <p className="text-xs! bg-background text-primary border border-primary px-3 py-1 rounded-full capitalize">
                    Article
                  </p>
                )}
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
                {n.alt}
              </h5>
              <p className="line-clamp-2 text-muted-foreground group-hover:text-white/50 transition-all duration-300 my-2">
                {n.description}_Lorem ipsum dolor, sit amet consectetur
                adipisicing elit. Tempore, reprehenderit?
              </p>

              <div className="inline-flex gap-2 items-center mt-2">
                <Avatar
                  name={n.author?.name || "Unknown"}
                  colors={[
                    "#3e77ab",
                    "#22b26e",
                    "#f2f26f",
                    "#fff7bd",
                    "#95cfb7",
                  ]}
                  variant="beam"
                  size={20}
                />
                <p className="text-sm! group-hover:text-white text-health normal-case line-clamp-1">
                  {n.author?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OurNewsGrid;
