"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SearchArea from "@/components/utility/SearchArea";
import SimplePagination from "@/components/utility/simple-pagination";
import { cn } from "@/lib/utils";
import { HotelType } from "@/types/hotel.types";
import Avatar from "boring-avatars";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ClientHotelPublic = ({
  hotel,
  locale,
  meta,
  links,
  perPage,
}: {
  hotel: HotelType[];
  locale: string;
  meta: any;
  links: any;
  perPage: number;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="md:grid lg:grid-cols-3 md:grid-cols-2 flex flex-col gap-5">
        {loading
          ? Array.from({ length: perPage }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-auto aspect-video rounded-2xl"
              />
            ))
          : hotel.map((v, i) => {
              return (
                <div
                  key={i}
                  className="relative lg:aspect-video aspect-3/4 h-auto w-full group/hotel-card hover:outline-3 hover:outline-health rounded-2xl transition-all duration-200"
                >
                  <Link href={`/${locale}/hotel/${v.slug}`}>
                    <div className="overflow-hidden rounded-2xl">
                      {v.name && v.highlight_image ? (
                        <Image
                          src={v.highlight_image}
                          alt={v.name || "hotel highlight_image"}
                          width={720}
                          height={720}
                          className="object-cover w-full h-auto lg:aspect-video aspect-3/4 rounded-2xl border group-hover/hotel-card:scale-105 transition-all duration-200"
                        />
                      ) : (
                        <Image
                          src={"https://placehold.co/720x405.png"}
                          alt={v.name || "hotel highlight_image"}
                          width={720}
                          height={720}
                          className="object-cover w-full h-auto lg:aspect-video aspect-3/4 rounded-2xl border group-hover/hotel-card:scale-105 transition-all duration-200"
                        />
                      )}
                    </div>
                    <div className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-2 absolute bottom-0 p-4 z-10">
                      <div className="w-16! h-16! shrink-0">
                        {v.name && v.logo ? (
                          <Image
                            src={v.logo}
                            alt={v.name || "hotel Logo"}
                            width={100}
                            height={100}
                            className="object-cover w-16! h-16!  rounded-full border"
                          />
                        ) : (
                          <Avatar
                            name={v.name}
                            className="w-16! h-16! border rounded-full"
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
                        )}
                      </div>
                      <div>
                        <h6 className="font-semibold text-white line-clamp-2 mb-1">
                          {v.name}
                        </h6>
                      </div>
                    </div>
                    <div className="absolute bottom-0 bg-linear-to-t from-black rounded-2xl w-full h-1/2" />
                    <div className="absolute top-0 bg-linear-to-b from-black/20 rounded-2xl w-full h-1/7" />
                  </Link>
                </div>
              );
            })}
      </div>
      <div className="mb-20">
        <SimplePagination
          meta={meta}
          links={links}
          show={[9, 27, 48]}
          defaultPerPage={9}
          onLoadingChange={setLoading}
        />
      </div>
      <SearchArea target="hotels" />
    </>
  );
};

export default ClientHotelPublic;
