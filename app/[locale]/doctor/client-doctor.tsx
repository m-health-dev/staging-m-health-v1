"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SearchArea from "@/components/utility/SearchArea";
import SimplePagination from "@/components/utility/simple-pagination";
import { cn } from "@/lib/utils";
import { DoctorType } from "@/types/doctor.types";
import { VendorType } from "@/types/vendor.types";
import Avatar from "boring-avatars";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ClientDoctorPublic = ({
  doctor,
  locale,
  meta,
  links,
  perPage,
}: {
  doctor: DoctorType[];
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
                className="w-full h-32 aspect-video rounded-2xl"
              />
            ))
          : doctor.map((v, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center group/vendor-card rounded-2xl transition-all duration-200 bg-white border hover:shadow-lg hover:outline-2 hover:outline-primary hover:scale-101 relative overflow-hidden"
                >
                  <Link href={`/${locale}/doctor/${v.slug}`}>
                    <div className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-2 p-4 z-10">
                      <div className="w-20! h-20! shrink-0">
                        {v.name && v.photo_url ? (
                          <Image
                            src={v.photo_url}
                            alt={v.name || "Doctor Profile Photo"}
                            width={100}
                            height={100}
                            className="object-cover w-20! h-20!  rounded-full border"
                          />
                        ) : (
                          <Avatar
                            name={v.name}
                            className="w-20! h-20! border rounded-full"
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
                        <h5 className="font-semibold text-primary line-clamp-2 mb-1">
                          {v.name}
                        </h5>
                        <div className="flex justify-start items-center flex-wrap gap-2">
                          {v.specialty?.slice(0, 2).map((s, i) => (
                            <div
                              key={i}
                              className={cn(
                                "px-3 py-1 bg-transparent border border-health text-health rounded-xl capitalize truncate inline-flex w-fit"
                              )}
                            >
                              <p className="text-xs!">{s}</p>
                            </div>
                          ))}
                          {v.specialty.length > 2 && (
                            <p className="text-health text-xs!">
                              + {v.specialty.length - 2}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* <div className="absolute bottom-0 bg-linear-to-t from-black rounded-2xl w-full h-1/2" />
                    <div className="absolute top-0 bg-linear-to-b from-black/20 rounded-2xl w-full h-1/7" /> */}
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
      <SearchArea target="doctors" />
    </>
  );
};

export default ClientDoctorPublic;
