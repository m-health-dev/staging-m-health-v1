import { cn } from "@/lib/utils";
import { VendorType } from "@/types/vendor.types";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense } from "react";
import Avatar from "boring-avatars";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { Skeleton } from "../ui/skeleton";
import { InsuranceType } from "@/types/insurance.types";
import { getInsuranceByID } from "@/lib/insurance/get-insurance";

const InsuranceCardSlide = ({ id, locale }: { id: string; locale: string }) => {
  const [data, setData] = React.useState<InsuranceType | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const result = await getInsuranceByID(id);
      if (isMounted) {
        setData(result.data);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);
  if (!data) {
    return <SkeletonContent />;
  }
  return (
    <Suspense fallback={<SkeletonContent />}>
      <Content v={data} locale={locale} />
    </Suspense>
  );
};

export default InsuranceCardSlide;

const SkeletonContent = () => {
  return <Skeleton className="w-full h-auto aspect-video rounded-2xl" />;
};

const Content = ({ v, locale }: { v: InsuranceType; locale: string }) => {
  return (
    <div
      key={v.id}
      className="relative lg:aspect-video aspect-3/4 h-auto w-full group/vendor-card hover:outline-3 hover:outline-health rounded-2xl transition-all duration-200"
    >
      <Link href={`/${locale}/insurance/${v.slug}`}>
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
            <h5 className="font-semibold text-white line-clamp-1 mb-1">
              {v.name}
            </h5>
            <div className="flex justify-start items-center flex-wrap gap-2">
              {v.specialist?.slice(0, 2).map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-3 py-1 bg-transparent border border-white text-white rounded-xl capitalize truncate inline-flex w-fit",
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
