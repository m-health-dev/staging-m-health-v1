"use client";

import Image from "next/image";
import Avatar from "boring-avatars";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getUserByID } from "@/lib/users/get-users";
import Link from "next/link";
import { getDoctorsByID } from "@/lib/doctor/get-doctor";

const doctorCache: Record<string, any> = {};

const AvatarDoctor = ({
  doctor,
  size = "sm",
  locale,
  asCard,
}: {
  doctor?: any;
  size?: "sm" | "md" | "lg";
  locale: string;
  asCard?: boolean;
}) => {
  // const userImage = user?.avatar_url;
  // const userName = user?.fullname;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useRouter();

  useEffect(() => {
    // if author changes, don't keep previous broken-image state
    setImageError(false);
  }, [doctor]);

  useEffect(() => {
    const loadData = async () => {
      if (!doctor) {
        setData(null);
        setLoading(false);
        return;
      }

      const key = `${doctor}`;

      // kalau sudah ada di cache → langsung pakai
      if (doctorCache[key]) {
        setData(doctorCache[key]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        let res = null;

        res = (await getDoctorsByID(doctor)).data;

        const result = res ?? null;

        doctorCache[key] = result; // simpan cache
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [doctor]);

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
  data.photo_url ? (
    <div>
      <Link href={`/doctor/${doctor}`}>
        <button
          // onClick={() => router.push(`/${locale}/${type}/${data.slug}`)}
          className="cursor-pointer"
        >
          <div className="inline-flex gap-2 items-center">
            <Image
              src={
                imageError ? "https://placehold.co/80x80/png" : data.photo_url
              }
              alt={data.fullname || "user-profile-image"}
              width={80}
              height={80}
              className={cn(
                "object-cover  rounded-full border",
                size === "sm" && "w-7 h-7",
                size === "md" && "w-10 h-10",
                size === "lg" && "w-14 h-14",
              )}
              onError={() => setImageError(true)}
            />
            <p
              className={cn(
                " text-health normal-case line-clamp-1",
                size === "sm" && "text-xs!",
                size === "md" && "text-sm!",
                size === "lg" && "text-base!",
              )}
            >
              {data.name}
            </p>
          </div>
        </button>
      </Link>
    </div>
  ) : (
    <Link href={`/doctor/${doctor}`}>
      <div className="inline-flex gap-2 items-center">
        <Avatar
          name={data.name ?? data.name ?? "Unknown"}
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
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <div>
          <p
            className={cn(
              " text-health normal-case line-clamp-1",
              size === "sm" && "text-xs!",
              size === "md" && "text-sm!",
              size === "lg" && "text-base!",
            )}
          >
            {data.fullname ?? data.email ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AvatarDoctor;
