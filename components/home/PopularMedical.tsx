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
  const wellness = await get5ImageWellness();
  const medical = await get5ImageMedical();
  const hospitalImage = await get10ImageHospital();
  const random = await get5Image();
  const rsProv = await getRSByProvince("Jawa Timur");
  const rsCity = await getRSByCity("Malang");
  const data = [...hospitalImage.results, ...random.results];
  return (
    <div className="bg-health pt-[5vh] pb-[30vh] -mt-[20vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-white pt-[3vh] pb-[8vh]">
          Popular Medical
        </h1>
      </ContainerWrap>
      <PopularMedSlide data={data} hospital={rsCity} />
    </div>
  );
};

export default PopularMedical;
