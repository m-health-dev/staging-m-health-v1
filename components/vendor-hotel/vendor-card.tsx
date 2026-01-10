import { cn } from "@/lib/utils";
import { VendorType } from "@/types/vendor.types";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Avatar from "boring-avatars";

const VendorCard = ({ v, locale }: { v: VendorType; locale: string }) => {
  return (
    <div
      key={v.id}
      className="relative lg:aspect-video aspect-3/4 h-auto w-full group/vendor-card hover:outline-3 hover:outline-health rounded-2xl transition-all duration-200"
    >
      <Link href={`/${locale}/vendor/${v.slug}`}>
        <div className="absolute top-0 p-4 z-10">
          <div
            className={cn(
              "px-3 py-1 bg-white rounded-xl capitalize truncate inline-flex w-fit",
              v.category === "hospital" && "bg-health text-white",
              v.category === "coach" && "bg-amber-500 text-white",
              v.category === "product" && "bg-primary text-white"
            )}
          >
            <p className="lg:text-sm! text-xs!">{v.category}</p>
          </div>
        </div>
        {v.location && (
          <div className="absolute top-0 right-0 p-4 z-10">
            <div
              className={cn(
                "px-3 py-1 bg-white rounded-xl capitalize truncate inline-flex w-fit text-primary"
              )}
            >
              <p className="lg:text-sm! text-xs!">{v.location.split(",")[0]}</p>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl">
          {v.name && v.highlight_image ? (
            <Image
              src={v.highlight_image}
              alt={v.name || "Vendor highlight_image"}
              width={720}
              height={720}
              className="object-cover w-full h-auto lg:aspect-video aspect-3/4 rounded-2xl border group-hover/vendor-card:scale-105 transition-all duration-200"
            />
          ) : (
            <Image
              src={"https://placehold.co/720x405.png"}
              alt={v.name || "Vendor highlight_image"}
              width={720}
              height={720}
              className="object-cover w-full h-auto lg:aspect-video aspect-3/4 rounded-2xl border group-hover/vendor-card:scale-105 transition-all duration-200"
            />
          )}
        </div>
        <div className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-2 absolute bottom-0 p-4 z-10">
          <div className="w-16! h-16! shrink-0">
            {v.name && v.logo ? (
              <Image
                src={v.logo}
                alt={v.name || "Vendor Logo"}
                width={100}
                height={100}
                className="object-cover w-16! h-16!  rounded-full border"
              />
            ) : (
              <Avatar
                name={v.name}
                className="w-16! h-16! border rounded-full"
                colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
                variant="beam"
                size={20}
              />
            )}
          </div>
          <div>
            <h6 className="font-semibold text-white text-xl! line-clamp-1 mb-1">
              {v.name}
            </h6>
            <div className="flex justify-start items-center flex-wrap gap-2">
              {v.specialist?.slice(0, 2).map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-3 py-1 bg-transparent border border-white text-white rounded-xl capitalize truncate inline-flex w-fit"
                  )}
                >
                  <p className="text-xs!">{s}</p>
                </div>
              ))}
              {v.specialist.length > 2 && (
                <p className="text-white text-xs!">
                  + {v.specialist.length - 2}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 bg-linear-to-t from-black rounded-2xl w-full h-1/2" />
        <div className="absolute top-0 bg-linear-to-b from-black/20 rounded-2xl w-full h-1/7" />
      </Link>
    </div>
  );
};

export default VendorCard;
