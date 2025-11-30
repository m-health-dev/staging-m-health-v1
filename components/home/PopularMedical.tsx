import {
  get10ImageHospital,
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";
import PopularProgramGrid from "./PopularProgramGrid";
import PopularMedSlide from "./PopularMedSlide";
import { getDummyRS, getRSByCity, getRSByProvince } from "@/lib/dummyRS";
import { getAllMedical } from "@/lib/medical/getMedical";
import { getLocale } from "next-intl/server";

interface RumahSakit {
  kode: string;
  nama: string;
  nama_prop: string;
  kab: string;
  alamat: string;
  TELEPON: string;
  pemilik: string;
  kelas: string;
}

const PopularMedical = async () => {
  const rsCity = await getRSByCity("Malang");
  const { data: medical } = await getAllMedical();
  const locale = await getLocale();
  return (
    <div className="bg-health pt-[5vh] pb-[30vh] -mt-[20vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-white pt-[2vh] pb-[6vh]">
          Popular Medical
        </h1>
      </ContainerWrap>
      <PopularMedSlide data={medical} locale={locale} hospital={rsCity} />
    </div>
  );
};

export default PopularMedical;
