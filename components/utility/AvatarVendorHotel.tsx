"use client";

import { getHotelByID } from "@/lib/hotel/get-hotel";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import Image from "next/image";
import Avatar from "boring-avatars";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const vendorHotelCache: Record<string, any> = {};

const AvatarVendorHotel = ({
  type,
  hotel_id,
  vendor_id,
  size = "sm",
  locale,
  arranged,
}: {
  type: "vendor" | "hotel";
  hotel_id?: string;
  vendor_id?: string;
  size?: "sm" | "md" | "lg";
  locale: string;
  arranged?: boolean;
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      const key = `${type}-${vendor_id || hotel_id}`;

      // kalau sudah ada di cache → langsung pakai
      if (vendorHotelCache[key]) {
        setData(vendorHotelCache[key]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        let res = null;

        if (type === "vendor" && vendor_id) {
          res = (await getVendorByID(vendor_id)).data;
        }

        if (type === "hotel" && hotel_id) {
          res = (await getHotelByID(hotel_id)).data;
        }

        const result = res ?? null;

        vendorHotelCache[key] = result; // simpan cache
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, vendor_id, hotel_id]);

  // fallback avatar ketika loading atau logo tidak tersedia
  return loading ? (
    <div className="inline-flex gap-2 items-center">
      <div
        className={cn(
          size === "sm" && "w-7 h-7",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-14 h-14",
        )}
      >
        <Skeleton
          className={cn(
            "rounded-full",
            size === "sm" && "w-7 h-7",
            size === "md" && "w-10 h-10",
            size === "lg" && "w-14 h-14",
          )}
        />
      </div>
      <div
        className={cn(
          "w-32",
          size === "sm" && "h-5",
          size === "md" && "h-7",
          size === "lg" && "h-10",
        )}
      >
        <Skeleton
          className={cn(
            "w-32 rounded-full",
            size === "sm" && "h-5",
            size === "md" && "h-7",
            size === "lg" && "h-10",
          )}
        />
      </div>
    </div>
  ) : // Jika data ada dan memiliki logo
  data.logo !== null ? (
    <div>
      <button
        onClick={() => router.push(`/${locale}/${type}/${data.slug}`)}
        className="cursor-pointer"
      >
        <div className="inline-flex gap-2 items-center">
          <Image
            src={data.logo}
            alt={data.slug || "vendor-hotel-logo"}
            width={80}
            height={80}
            className={cn(
              "object-cover  rounded-full border",
              size === "sm" && "w-7 h-7",
              size === "md" && "w-10 h-10",
              size === "lg" && "w-14 h-14",
            )}
          />
          <p
            className={cn(
              " text-health normal-case line-clamp-1 -mb-0.5",
              size === "sm" && "text-xs!",
              size === "md" && "text-sm!",
              size === "lg" && "text-base!",
            )}
          >
            {data.name}
          </p>
        </div>
      </button>
    </div>
  ) : (
    <Avatar
      name={data?.name || type.toUpperCase()}
      className={cn(
        "border rounded-full",
        size === "sm" && "w-7 h-7",
        size === "md" && "w-10 h-10",
        size === "lg" && "w-14 h-14",
      )}
      colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
      variant="beam"
      size={80}
    />
  );
};

export default AvatarVendorHotel;
