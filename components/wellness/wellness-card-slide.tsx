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
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import { WellnessType } from "@/types/wellness.types";
import { Spinner } from "../ui/spinner";
import { motion } from "motion/react";
import { routing } from "@/i18n/routing";

const WellnessCardSlide = ({
  id,
  locale,
  index,
}: {
  id: string;
  locale: string;
  index: number;
}) => {
  const [data, setData] = React.useState<WellnessType | null>(null);

  const t = useTranslations("utility");

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const result = await getWellnessByID(id);
      if (isMounted) {
        setData(result.data.data);
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
        d={data}
        i={index}
        locale={locale}
        labels={{
          days: t("days"),
          night: t("night"),
        }}
      />
    </Suspense>
  );
};

export default WellnessCardSlide;

const SkeletonContent = () => {
  return <Skeleton className="w-full h-[400px] rounded-2xl" />;
};

const Content = ({
  d,
  locale,
  labels,
  i,
}: {
  d: WellnessType;
  locale: string;
  labels: any;
  i: number;
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <Link
      href={`/${locale}/wellness/${d.slug}`}
      key={d.id}
      className="aspect-4/5 relative group cursor-pointer group"
      onMouseEnter={() => setHoveredIndex(i)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="relative aspect-4/5 rounded-2xl group-hover:outline-2 group-hover:outline-health transition-all duration-100">
        <div
          className={cn(
            "absolute inset-0 z-10 bg-white/20 backdrop-blur-2xl rounded-2xl flex w-full justify-center items-center transition-all duration-500",
            imageLoaded ? "opacity-0" : "opacity-100",
          )}
        >
          <Spinner />
        </div>

        <Image
          src={
            d.highlight_image ||
            "https://placehold.co/720x403.png?text=IMAGE+NOT+FOUND"
          } // Ganti dengan slide.image_url saat tersedia
          width={720}
          height={403}
          alt={locale === routing.defaultLocale ? d.id_title : d.en_title}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
          className={cn(
            "w-full aspect-4/5 object-center object-cover rounded-2xl z-10 transition-all duration-500",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      {/* <Image
        src={d.highlight_image}
        width={500}
        height={500}
        alt={d.slug}
        className="object-center w-full h-full aspect-4/5 object-cover rounded-2xl group-hover:outline-2 group-hover:outline-health transition-all duration-100"
      /> */}
      <motion.div
        initial={{ y: 0, z: 50 }}
        animate={{ y: hoveredIndex === i ? 0 : 0 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        className="absolute bottom-0 z-10 lg:p-5 p-3 transition-all duration-300 h-auto"
      >
        <div className="overflow-hidden mb-2">
          <h5 className="text-white font-bold capitalize line-clamp-3">
            {locale === routing.defaultLocale ? d.id_title : d.en_title}
          </h5>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            hoveredIndex === i ? "lg:mt-1 mt-1" : "lg:mt-1 -mt-1"
          }`}
        >
          <div>
            <p className="text-white/50 lg:line-clamp-3 lg:text-base! text-sm! line-clamp-2">
              {locale === routing.defaultLocale ? d.id_tagline : d.en_tagline}
            </p>
            <div className="flex w-full! mt-5">
              <AvatarVendorHotel
                type="vendor"
                vendor_id={d.vendor_id}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </motion.div>
      <div className="bg-linear-to-t from-black absolute bottom-0 w-full h-full transition-all duration-300 delay-300 rounded-2xl"></div>
    </Link>
  );
};
