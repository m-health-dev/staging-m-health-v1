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
import { getInsuranceByID } from "@/lib/insurance/get-insurance";

const insuranceCache: Record<string, any> = {};

const AvatarInsurance = ({
  insurance,
  size = "sm",
  locale,
  asCard,
}: {
  insurance?: any;
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
  }, [insurance]);

  useEffect(() => {
    const loadData = async () => {
      if (!insurance) {
        setData(null);
        setLoading(false);
        return;
      }

      const key = `${insurance}`;

      // kalau sudah ada di cache → langsung pakai
      if (insuranceCache[key]) {
        setData(insuranceCache[key]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        let res = null;

        res = (await getInsuranceByID(insurance)).data;

        const result = res ?? null;

        insuranceCache[key] = result; // simpan cache
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [insurance]);

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
  data.logo ? (
    <div className="-mb-1.5">
      <Link href={`/insurance/${data.slug}`}>
        <button
          // onClick={() => router.push(`/${locale}/${type}/${data.slug}`)}
          className="cursor-pointer"
        >
          <div className="inline-flex gap-2 items-center">
            <Image
              src={imageError ? "https://placehold.co/80x80/png" : data.logo}
              alt={data.name || "user-profile-image"}
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
                " text-primary normal-case line-clamp-1",
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
    <Link href={`/insurance/${data.slug}`}>
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
              " text-primary normal-case line-clamp-1",
              size === "sm" && "text-xs!",
              size === "md" && "text-sm!",
              size === "lg" && "text-base!",
            )}
          >
            {data.name ?? data.agent_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AvatarInsurance;
