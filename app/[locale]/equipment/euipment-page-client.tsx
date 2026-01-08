"use client";

import SimplePagination from "@/components/utility/simple-pagination";
import { PackageType } from "@/types/packages.types";
import Link from "next/link";
import Image from "next/image";
import AvatarVendorHotel from "@/components/utility/AvatarVendorHotel";
import React from "react";
import { MedicalEquipmentType } from "@/types/medical-equipment.types";
import { formatRupiah } from "@/components/Form/PriceInput";
import { calculateDiscount } from "@/components/utility/PriceInfo";

const EquipmentClientPage = ({
  equipment,
  locale,
  labels,
  meta,
  links,
}: {
  equipment: MedicalEquipmentType[];
  locale: string;
  labels: any;
  meta: any;
  links: any;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  return (
    <div className="mb-[10vh]">
      <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 lg:pb-0 px-2">
        {equipment.map((slide, key) => (
          <div
            key={key}
            className="flex flex-col rounded-2xl w-full group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(key)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              href={`/${locale}/equipment/${slide.slug}`}
              className="flex flex-col w-full h-[calc(100%-20px)] relative group-hover:shadow-md rounded-2xl transition-all duration-300"
            >
              <div className="relative">
                {/* <p className="absolute -bottom-2.5 left-0 text-muted-foreground bg-white px-4 pt-2 pb-5 rounded-t-2xl text-sm! mb-3 z-50 ">
                  {slide.duration_by_day} {labels.days}{" "}
                  {slide.duration_by_night} {labels.night}
                </p> */}
                <Image
                  src={slide.highlight_image} // TODO: Ganti dengan slide.full ketika sudah ada gambarnya
                  width={720}
                  height={405}
                  alt={locale === "id" ? slide.id_title : slide.en_title}
                  className="w-full aspect-square! object-cover object-center rounded-t-2xl"
                />
              </div>

              <div className="flex flex-col justify-center grow  max-w-full bg-white rounded-2xl -translate-y-5 p-4 h-full transition-all duration-100 z-50">
                <div className="overflow-hidden">
                  <div>
                    <h5 className="capitalize font-bold text-primary lg:line-clamp-3 line-clamp-1">
                      {locale === "id" ? slide.id_title : slide.en_title}
                    </h5>
                  </div>
                </div>
                <div className="mt-1 overflow-hidden">
                  <div>
                    <div className="price mt-5">
                      <div className="text-start">
                        <div className="inline-flex items-center gap-3">
                          <div className="font-semibold text-red-500 bg-red-50 border-red-500 border px-2 py-1 rounded-full inline-flex w-fit">
                            <p className="inline-flex gap-1 items-center text-xs!">
                              {/* <Percent className="size-5 text-red-500 bg-white rounded-full p-1" /> */}
                              {calculateDiscount(
                                slide.real_price,
                                slide.discount_price
                              )}
                            </p>
                          </div>
                          <p className="text-muted-foreground">
                            <s>{formatRupiah(slide.real_price)}</s>
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          <h5 className="text-primary font-bold">
                            {formatRupiah(slide.discount_price)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex gap-2 items-center mt-4">
                  <AvatarVendorHotel
                    type="vendor"
                    vendor_id={slide.vendor_id}
                    locale={locale}
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
    </div>
  );
};

export default EquipmentClientPage;
