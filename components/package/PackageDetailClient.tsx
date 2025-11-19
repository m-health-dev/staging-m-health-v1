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
  Plane,
  Plus,
  Sun,
  Utensils,
  Venus,
  VenusAndMars,
} from "lucide-react";
import Avatar from "boring-avatars";
import { Input } from "../ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

const PackageDetailClient = ({
  image,
  gender,
}: {
  image: any[];
  gender: string;
}) => {
  const swiperRef = useRef<any>(null);
  const [count, setCount] = useState(1);
  const price = 33000000;

  // Hitung harga langsung dari count agar selalu akurat
  const countedPrice = price * count;
  const payId = uuidv4();

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  // ketika input manual
  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    let val = parseInt(e.target.value);

    if (isNaN(val)) {
      setCount(1);
      return;
    }

    // Batas 1–5
    if (val < 1) val = 1;
    if (val > 5) val = 5;

    setCount(val);
  }

  function handleClickPlus() {
    setCount((prev) => {
      const newVal = Math.min(prev + 1, 5);
      return newVal;
    });
  }

  function handleClickMin() {
    setCount((prev) => {
      const newVal = Math.max(prev - 1, 1);
      return newVal;
    });
  }

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
            {image.map((img, key) => (
              <SwiperSlide key={key} className="border">
                <Image
                  src={img.full}
                  width={500}
                  height={500}
                  className="w-full aspect-square object-center object-cover"
                  alt={img.alt}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="lg:px-10 px-3 absolute top-0 left-0 z-20 flex h-full items-center transition-all duration-300 translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
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
          <div className="lg:px-10 px-3 absolute top-0 right-0 z-10 flex h-full items-center transition-all duration-300 -translate-x-20 group-hover/slide:translate-x-0 opacity-0 group-hover/slide:opacity-100">
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
        <div className="mb-5">
          {gender === "male" ? (
            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
              <Mars className="size-4 text-primary" />
              <p className="text-primary text-sm">Male</p>
            </div>
          ) : gender === "female" ? (
            <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
              <Venus className="size-4 text-pink-500" />
              <p className="text-pink-500 text-sm">Female</p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
              <VenusAndMars className="size-4 text-health" />
              <p className="text-health text-sm">Unisex</p>
            </div>
          )}
        </div>
        <h2 className="package_title font-bold text-primary">
          Prime Health Journey
        </h2>
        <h6 className="package_tagline mt-2">
          Premium Wellness & Ocean Serenity Journey
        </h6>
        <div className="flex lg:flex-row flex-col gap-5 lg:items-center items-start mt-5">
          <div>
            <p className="text-xs! font-medium text-muted-foreground mb-1">
              Rumah Sakit
            </p>
            <div className="inline-flex gap-2 items-center">
              <Avatar
                name={"RS Ngoerah Sun Bali"}
                colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
                variant="beam"
                size={20}
              />
              <p className="text-health normal-case line-clamp-1">
                RS Ngoerah Sun Bali
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs! font-medium text-muted-foreground mb-1">
              Hotel
            </p>
            <div className="inline-flex gap-2 items-center">
              <Avatar
                name={"The Legian Seminyak"}
                colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
                variant="beam"
                size={20}
              />
              <p className="text-health normal-case line-clamp-1">
                The Legian Seminyak
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap lg:gap-5 gap-3 mt-5">
          <div className="bg-white p-4 border inline-flex gap-5 rounded-2xl">
            <div className="inline-flex items-center gap-2">
              <Sun className="text-primary size-5" /> <p>3 days</p>
            </div>
            <div className="inline-flex items-center gap-2">
              <Moon className="text-primary size-5" /> <p>2 Night</p>
            </div>
          </div>
          <div className="bg-white p-4 border inline-flex gap-5 rounded-2xl">
            <div className="inline-flex items-center gap-2">
              <Plane className="size-5 text-primary" /> <p>Transportation</p>
            </div>
          </div>
          <div className="bg-white p-4 border inline-flex gap-5 rounded-2xl">
            <div className="inline-flex items-center gap-2">
              <Utensils className="size-5 text-primary" /> <p>3x Meal</p>
            </div>
          </div>
          <div className="bg-white p-4 border inline-flex gap-5 rounded-2xl">
            <div className="inline-flex items-center gap-2">
              <Cookie className="size-5 text-primary" /> <p>Snack</p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="package_content_medical">
            <h5 className="text-health font-bold mb-3">Medical</h5>
            <ul className="list-disc list-inside">
              <li>Doctor Consultation</li>
              <li>Full Blood & Lab Screening</li>
              <li>Cardiac & Body Composition</li>
              <li>Sensory & Vital Organ Screening</li>
              <li>Dental Screening</li>
              <li>Imaging & Radiology</li>
            </ul>
          </div>
          <div className="package_content_entertain mt-5">
            <h5 className="text-primary font-bold mb-3">Entertain</h5>
            <ul className="list-disc list-inside">
              <li>Gentle Yoga by The Legian (1Jt/ private session)</li>
              <li>Short trip to Pura Petitenget Temple (200rb)</li>
              <li>Sunset Beachfront Lounging</li>
              <li>Scenic Walk to Petitenget Beach</li>
              <li>
                In-house Balinese Massage, Ayuverdic or Herbal Treatments (1.5
                jt/ treatment)
              </li>
              <li>
                Visit Uluwatu Temple (20-25 mins) + Kecak Dance (optional if
                energy allows) (800rb ticket + private driver)
              </li>
            </ul>
          </div>
          <div className="package_content_detail mt-5 bg-white rounded-2xl p-4 border">
            <h5 className="text-muted-foreground font-bold mb-3">Detail</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure
              sapiente sit mollitia modi laborum aliquam nam id aut ea obcaecati
              possimus consequatur voluptatibus omnis velit suscipit atque sed
              provident fugit, totam saepe error sint molestias esse? Nisi
              quaerat fugiat architecto eos est provident expedita alias
              assumenda atque quidem, molestiae sint?{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border p-4">
          <p className="mb-3">Informasi Harga</p>
          {/* <div className="relative max-w-30 h-10">
            <button
              className="absolute left-3 top-3 disabled:text-muted-foreground text-primary"
              onClick={handleClickMin}
              disabled={count === 1}
            >
              <Minus className="size-4" />
            </button>
            <Input
              value={count}
              onChange={handleChangeInput}
              type="number"
              min={1}
              max={5}
              className="h-10 rounded-xl px-12 font-sans text-center"
            />

            <button
              className="absolute right-3 top-3 disabled:text-muted-foreground text-primary"
              onClick={handleClickPlus}
              disabled={count === 5}
            >
              <Plus className="size-4" />
            </button>
          </div>
          <div>
            <p className="text-sm! text-muted-foreground mt-1">
              Maksimal pembelian dalam satu waktu adalah{" "}
              <span className="underline decoration-health decoration-2">
                5
              </span>{" "}
              kali.
            </p>
          </div> */}
          <div className="price mt-5">
            <div className="text-start">
              <p className="text-muted-foreground">
                <s>Rp35.000.000</s>
              </p>
              <h5 className="text-primary font-bold">
                Rp{formatRupiah(countedPrice)}
              </h5>
            </div>
          </div>
          <div className="mt-5">
            <Link href={`/pay/${payId}`}>
              <button className="bg-health text-white w-full py-2 rounded-full">
                <p>Beli Sekarang</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </ContainerWrap>
  );
};

export default PackageDetailClient;
