import { getHotelByID } from "@/lib/hotel/get-hotel";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import Image from "next/image";
import Avatar from "boring-avatars";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const vendorHotelCache: Record<string, any> = {};

const AvatarVendorHotel = ({
  type,
  hotel_id,
  vendor_id,
}: {
  type: "vendor" | "hotel";
  hotel_id?: string;
  vendor_id?: string;
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
          res = await getVendorByID(vendor_id);
        }

        if (type === "hotel" && hotel_id) {
          res = await getHotelByID(hotel_id);
        }

        const result = res?.data?.data ?? null;

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

  // Jika data ada dan memiliki logo
  if (data?.logo) {
    return (
      <div className="inline-flex gap-2 items-center">
        <Image
          src={data.logo}
          alt={data.slug || "vendor-hotel-logo"}
          width={80}
          height={80}
          className="object-cover w-7 h-7 rounded-full border"
        />
        <p className="text-xs! text-health normal-case line-clamp-1">
          {data.name}
        </p>
      </div>
    );
  }

  // fallback avatar ketika loading atau logo tidak tersedia
  return loading ? (
    <div className="inline-flex gap-2 items-center">
      <div className="w-7 h-7">
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>
      <div className="w-32 h-5">
        <Skeleton className="w-32 h-5 rounded-full" />
      </div>
    </div>
  ) : (
    <Avatar
      name={data?.name || type.toUpperCase()}
      className="w-20 h-20 border rounded-full"
      colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
      variant="beam"
      size={80}
    />
  );
};

export default AvatarVendorHotel;
