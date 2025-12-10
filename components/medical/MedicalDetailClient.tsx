"use client";

import React, { useRef, useState } from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import {
  Cookie,
  Mars,
  Minus,
  Moon,
  Percent,
  Plane,
  Plus,
  Sun,
  Ticket,
  TicketPercent,
  Utensils,
  Venus,
  VenusAndMars,
} from "lucide-react";
import Avatar from "boring-avatars";
import { Input } from "../ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { PackageType } from "@/types/packages.types";
import { routing } from "@/i18n/routing";
import AvatarVendorHotel from "../utility/AvatarVendorHotel";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MedicalType } from "@/types/medical.types";

function calculateDiscount(real: number, disc: number) {
  const result = Math.round((disc / real) * 100);
  const calc = 100 - result;
  const response = `${calc}%`;

  return response;
}

const MedicalDetailClient = ({
  medical: p,
  locale,
}: {
  medical: MedicalType;
  locale: string;
}) => {
  const swiperRef = useRef<any>(null);
  const sliderImage = [p.highlight_image, ...p.reference_image];

  const t = useTranslations("utility");

  const [count, setCount] = useState(1);
  const price = 33000000;

  // Hitung harga langsung dari count agar selalu akurat
  const countedPrice = price * count;
  const payId = uuidv4();

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  // ketika input manual
  // function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
  //   let val = parseInt(e.target.value);

  //   if (isNaN(val)) {
  //     setCount(1);
  //     return;
  //   }

  //   // Batas 1–5
  //   if (val < 1) val = 1;
  //   if (val > 5) val = 5;

  //   setCount(val);
  // }

  // function handleClickPlus() {
  //   setCount((prev) => {
  //     const newVal = Math.min(prev + 1, 5);
  //     return newVal;
  //   });
  // }

  // function handleClickMin() {
  //   setCount((prev) => {
  //     const newVal = Math.max(prev - 1, 1);
  //     return newVal;
  //   });
  // }

  return (
    <ContainerWrap className="grid lg:grid-cols-8 grid-cols-1 gap-5 my-20">
      <div className="lg:col-span-2">
        <div className="w-full flex flex-col items-center relative group/slide">
          {/* Swiper Container */}
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={true}
            grabCursor={true}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full rounded-2xl"
          >
            {sliderImage.map((img, key) => (
              <SwiperSlide key={key} className="border">
                <Image
                  src={img}
                  width={500}
                  height={500}
                  className="w-full aspect-square object-center object-cover"
                  alt={img}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="lg:px-5 px-3 absolute top-0 left-0 z-20 flex h-full items-center transition-all duration-300 translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperRef.current) {
                  swiperRef.current.slidePrev();
                }
              }}
              className="bg-white lg:h-12 lg:w-12 h-9 w-9 rounded-full border border-primary flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-primary group-hover:text-background z-20 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <div className="absolute -left-0.5 h-16 w-16 rounded-full bg-primary translate-x-50 group-hover:translate-x-0 transition-transform duration-500  ease-in-out z-19"></div>
            </button>
          </div>
          <div className="lg:px-5 px-3 absolute top-0 right-0 z-10 flex h-full items-center transition-all duration-300 -translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperRef.current) {
                  swiperRef.current.slideNext();
                }
              }}
              className="bg-white lg:h-12 lg:w-12 h-9 w-9 rounded-full border border-primary flex justify-center items-center transition-all duration-500 pointer-events-auto cursor-pointer relative overflow-hidden group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-primary group-hover:text-background z-20 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
              <div className="absolute -left-0.5 h-16 w-16 rounded-full bg-primary -translate-x-20 group-hover:translate-x-0 transition-transform duration-500  ease-in-out z-19"></div>
            </button>
          </div>
          {/* Navigation Buttons */}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="mb-8">
          {p.spesific_gender === "male" ? (
            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
              <Mars className="size-4 text-primary" />
              <p className="text-primary text-sm!">{t("male")}</p>
            </div>
          ) : p.spesific_gender === "female" ? (
            <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
              <Venus className="size-4 text-pink-500" />
              <p className="text-pink-500 text-sm!">{t("female")}</p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
              <VenusAndMars className="size-4 text-health" />
              <p className="text-health text-sm!">{t("unisex")}</p>
            </div>
          )}
        </div>
        <h2 className="package_title font-bold text-primary">
          {locale === routing.defaultLocale ? p.id_title : p.en_title}
        </h2>
        <h6 className="package_tagline mt-2">
          {locale === routing.defaultLocale ? p.id_tagline : p.en_tagline}
        </h6>
        <div className="flex lg:flex-row flex-col gap-8 lg:items-center items-start mt-8">
          <div>
            <p className="text-xs! font-medium text-muted-foreground mb-2">
              {t("hospital")}
            </p>
            <AvatarVendorHotel
              size="md"
              type="vendor"
              vendor_id={p.vendor_id}
            />
          </div>
          <div>
            <p className="text-xs! font-medium text-muted-foreground mb-2">
              Hotel
            </p>
            <AvatarVendorHotel size="md" type="hotel" hotel_id={p.hotel_id} />
          </div>
        </div>
        <div className="flex flex-wrap lg:gap-5 gap-3 mt-5">
          <div className="bg-white p-4 border inline-flex gap-5 rounded-2xl">
            <div className="inline-flex items-center gap-2">
              <Sun className="text-primary size-5" />{" "}
              <p>
                {p.duration_by_day} {t("days")}
              </p>
            </div>
            <div className="inline-flex items-center gap-2">
              <Moon className="text-primary size-5" />{" "}
              <p>
                {p.duration_by_night} {t("night")}
              </p>
            </div>
          </div>
          {p.included.map((inc, i) => (
            <div
              key={inc}
              className="bg-white p-4 border inline-flex gap-5 rounded-2xl"
            >
              <div className="inline-flex items-center gap-2 capitalize">
                <p>{inc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 mt-5 border rounded-2xl">
          <p className="text-sm! text-muted-foreground">{t("detail")}</p>
          <div
            className="prose max-w-none -mt-3 -mb-5"
            dangerouslySetInnerHTML={{
              __html:
                locale === routing.defaultLocale
                  ? p.id_medical_package_content
                  : p.en_medical_package_content,
            }}
          />
        </div>

        {/* <Tabs defaultValue="medical" className="w-full mt-5 border rounded-2xl">
          <TabsList className="bg-transparent! overflow-hidden">
            <TabsTrigger value="medical" className="w-fit">
              <p>{t("medical")}</p>
            </TabsTrigger>
            <TabsTrigger value="detail">
              <p>{t("detail")}</p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="medical">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  locale === routing.defaultLocale
                    ? p.id_medical_package_content
                    : p.en_medical_package_content,
              }}
            />
          </TabsContent>
          <TabsContent value="detail">
            {" "}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  locale === routing.defaultLocale ? p.id_detail : p.en_detail,
              }}
            />
          </TabsContent>
        </Tabs> */}
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border p-4">
          <p className="mb-3 font-medium">{t("price_info")}</p>
          <div className="price mt-5">
            <div className="text-end">
              <div className="inline-flex items-center gap-3">
                <p className="text-muted-foreground">
                  <s>Rp{formatRupiah(p.real_price)}</s>
                </p>
                <div className="font-semibold text-red-500 bg-red-50 border-red-500 border px-2 py-1 rounded-full inline-flex w-fit">
                  <p className="inline-flex gap-1 items-center text-xs!">
                    {/* <Percent className="size-5 text-red-500 bg-white rounded-full p-1" /> */}
                    {calculateDiscount(p.real_price, p.discount_price)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-end mt-2">
                <p className="text-sm! text-muted-foreground">Subtotal</p>
                <h5 className="text-primary font-bold">
                  Rp{formatRupiah(p.discount_price)}
                </h5>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Link href={`/pay/${payId}`}>
              <button className="bg-health text-white w-full py-2 rounded-full">
                <p>{t("buy")}</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </ContainerWrap>
  );
};

export default MedicalDetailClient;
