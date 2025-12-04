import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getImageAbout } from "@/lib/unsplashImage";
import Image from "next/image";
import React from "react";

const About = async () => {
  const img = await getImageAbout();
  const data = img.results[0];
  return (
    <Wrapper>
      <ContainerWrap
        size="xl"
        className="pb-20 grid lg:grid-cols-2 gap-10 my-20"
      >
        <div className="">
          <Image
            src={data.full}
            width={500}
            height={500}
            alt={data.alt}
            className="w-full aspect-video object-center object-cover rounded-2xl sticky top-36"
          />
        </div>
        <div>
          <div>
            <div className="mb-10">
              <h1 className="font-bold text-primary">Tentang Kami</h1>
            </div>
          </div>
          <div>
            <div className="space-y-5 text-lg!">
              <p>
                M HEALTH adalah platform kesehatan digital yang dirancang untuk
                memahami kebutuhan Anda akan informasi medis yang cepat, akurat,
                dan terpercaya. Kami menyadari bahwa mencari solusi kesehatan
                seringkali membingungkan. Kami hadir sebagai “digital front
                door” — pintu gerbang kesehatan yang memudahkan siapa pun untuk
                bertanya, berkonsultasi, dan merencanakan perjalanan medis
                maupun wellness dengan cara yang sederhana, transparan, dan
                terjangkau.
              </p>
              <h3 className="font-bold text-primary">Layanan Kami</h3>
              <ul className="ml-4">
                <li className="list-disc">
                  <strong>Interactive Health Chat</strong>: Melalui teknologi
                  berbasis AI dan dukungan tim medis, kami menyediakan kanal
                  informasi kesehatan 24/7 untuk menjawab pertanyaan seputar
                  gejala dan langkah pertolongan pertama.
                </li>
                <li className="list-disc">
                  <strong>Telekonsultasi</strong>: Akses langsung ke dokter umum
                  dan spesialis melalui panggilan video atau chat berbayar yang
                  sangat terjangkau. Konsultasi medis kini semudah dan senyaman
                  menghubungi teman, tanpa antrean panjang.
                </li>
                <li className="list-disc">
                  <strong>Pengelolaan Kualitas Kesehatan</strong>:
                  Mengintegrasikan wearable SmartWatch, kegiatan kebugaran dan
                  alat kesehatan lainnya untuk memonitor data kesehatan
                  pengguna, baik individu maupun karyawan perusahaan.
                </li>
                <li className="list-disc">
                  <strong>Hospital Assistance & Referral</strong>: M HEALTH
                  bermitra dengan jaringan rumah sakit unggulan di berbagai kota
                  besar di Indonesia. Fitur Assistance kami memastikan Anda
                  mendapatkan akses prioritas ke fasilitas kesehatan yang sesuai
                  dengan kebutuhan medis dan preferensi lokasi Anda. Layanan
                  asistensi eksklusif untuk membantu Anda mendapatkan perawatan
                  lanjutan di berbagai Rumah Sakit terkemuka mitra kami di
                  seluruh Indonesia
                </li>
              </ul>
              <p>
                M HEALTH ingin memastikan setiap orang memiliki akses ke
                informasi, layanan, dan pengalaman kesehatan yang lebih
                manusiawi, terukur, dan berkelanjutan — dari pencegahan,
                pengobatan, hingga wellness.
              </p>
            </div>
          </div>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default About;
