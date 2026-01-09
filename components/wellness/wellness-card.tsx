import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { routing } from "@/i18n/routing";

import React from "react";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import { WellnessType } from "@/types/wellness.types";

const WellnessCard = ({
  locale,
  d,
  i,
}: {
  locale: string;
  d: WellnessType;
  i: number;
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  return (
    <Link
      href={`/${locale}/wellness/${d.slug}`}
      key={d.id}
      className="aspect-4/5 relative group cursor-pointer group"
      onMouseEnter={() => setHoveredIndex(i)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Image
        src={d.highlight_image}
        width={500}
        height={500}
        alt={d.slug}
        className="object-center w-full h-full aspect-4/5 object-cover rounded-2xl group-hover:outline-2 group-hover:outline-health transition-all duration-100"
      />
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

export default WellnessCard;
