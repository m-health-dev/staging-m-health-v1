import { cn } from "@/lib/utils";
import { VendorType } from "@/types/vendor.types";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense } from "react";
import Avatar from "boring-avatars";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { Skeleton } from "../ui/skeleton";
import { getMedicalByID } from "@/lib/medical/get-medical";
import { MedicalType } from "@/types/medical.types";
import { useTranslations } from "next-intl";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import { PackageType } from "@/types/packages.types";
import { getPackageByID } from "@/lib/packages/get-packages";

const PackageCardSlide = ({ id, locale }: { id: string; locale: string }) => {
  const [data, setData] = React.useState<PackageType | null>(null);

  const t = useTranslations("utility");

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const result = await getPackageByID(id);
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
      <Content
        v={data}
        locale={locale}
        labels={{
          days: t("days"),
          night: t("night"),
        }}
      />
    </Suspense>
  );
};

export default PackageCardSlide;

const SkeletonContent = () => {
  return <Skeleton className="w-full h-[400px] rounded-2xl" />;
};

const Content = ({
  v,
  locale,
  labels,
}: {
  v: PackageType;
  locale: string;
  labels: any;
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <div
      key={v.id}
      className="flex flex-col rounded-2xl w-full group cursor-pointer"
    >
      <Link
        href={`/${locale}/package/${v.slug}`}
        className="flex flex-col w-full h-[calc(100%-20px)] relative rounded-2xl transition-all duration-300"
      >
        <div className="relative">
          <p
            className={cn(
              v.duration_by_day !== 0 || v.duration_by_night !== 0
                ? "absolute bottom-6 left-2 text-muted-foreground bg-white px-4 py-2 rounded-full text-sm! mb-3 z-10 "
                : "hidden"
            )}
          >
            {v.duration_by_day !== 0 ? v.duration_by_day : ""}{" "}
            {v.duration_by_day !== 0 ? labels.days : ""}{" "}
            {v.duration_by_night !== 0 ? v.duration_by_night : ""}{" "}
            {v.duration_by_night !== 0 ? labels.night : ""}
          </p>
          <Skeleton
            className={cn(
              "absolute inset-0 z-10 rounded-2xl flex w-full justify-center items-center transition-all duration-500",
              imageLoaded ? "hidden" : "block"
            )}
          />

          <div className="aspect-square w-full h-auto rounded-2xl overflow-hidden">
            <Image
              src={
                v.highlight_image ||
                "https://placehold.co/720x403.png?text=IMAGE+NOT+FOUND"
              } // Ganti dengan v.image_url saat tersedia
              width={720}
              height={403}
              alt={locale === "id" ? v.id_title : v.en_title}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              className={cn(
                "relative w-full aspect-square object-center object-cover rounded-2xl transition-all duration-500  group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center grow  max-w-full bg-white rounded-2xl -translate-y-6 p-4 h-full transition-all duration-100 z-10 -mb-6">
          <div className="">
            <div>
              <h5 className="capitalize font-bold text-primary line-clamp-3">
                {locale === "id" ? v.id_title : v.en_title}
              </h5>
            </div>
          </div>
          <div className="mt-2 ">
            <div>
              <p className="text-muted-foreground line-clamp-2">
                {locale === "id" ? v.id_tagline : v.en_tagline}
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 items-center mt-4">
            <AvatarVendorHotel
              type="vendor"
              vendor_id={v.vendor_id}
              locale={locale}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
