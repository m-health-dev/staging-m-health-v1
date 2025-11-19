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
      <ContainerWrap size="xl" className="pb-20 grid grid-cols-2 gap-10 my-20">
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
                MALANG HEALTH TOURISM adalah sebuah program produk platform
                pengembangan ekosistem Kawasan Wisata Kesehatan di Malang Raya,
                kolaborasi dua Kementerian RI, yaitu Kementerian Pariwisata dan
                Ekonomi Kreatif RI serta Kementerian Kesehatan RI.
              </p>
              <p>
                Menteri Pariwisata dan Ekonomi Kreatif RI, Sandiaga Uno,
                menyatakan bahwa salah satu sektor yang diwaspadai yakni sektor
                kesehatan karena ada sekitar 600 ratus hingga 2 juta penduduk
                Indonesia menghabiskan US$11 miliar atau kurang lebih Rp160
                triliun lebih untuk berobat ke luar negeri, salah satu yang
                populer adalah ke Penang, Malaysia.
              </p>
              <p>
                Hal itu menurutnya bisa diatasi dengan peningkatan layanan
                kesehatan dalam negeri dalam konsep wisata kesehatan (medical
                tourism).
              </p>
              <p>
                Pada tanggal 16 April 2023, Menteri Pariwisata dan Ekonomi
                Kreatif/Kepala Pariwisata dan Ekonomi Kreatif
                (Menparekraf/Kabaparekraf) Sandiaga Salahuddin Uno meresmikan
                Malang Health Tourism sebagai asosiasi yang diharapkan dapat
                memperkuat ekosistem pariwisata berbasis kesehatan, sehingga
                menarik lebih banyak wisatawan yang melakukan pengobatan di
                Indonesia.
              </p>
              <p>
                Wisata Kesehatan telah ditetapkan sebagai salah satu program
                prioritas strategis nasional pemerintah Republik Indonesia.
                Malang menjadi kawasan health tourism keempat di Indonesia
                setelah Sumatra Utara dengan Medan Medical Tourism Board, Bali
                dengan Bali Medical Tourism Association, dan Sulawesi Utara
                dengan North Sulawesi Health Tourism.
              </p>
              <p>
                Ketua Umum terpilih Malang Health Tourism Board 2023-2028,
                Ardantya Syahreza , berharap dengan terbentuknya kepengurusan
                Malang Health Tourism, akan dapat menciptakan ekosistem
                peningkatan layanan kesehatan premium dengan Center of
                Excellence terintegrasi, yang dipadu dengan fasilitas wellness
                activities seperti olahraga lari, bersepeda, bahkan yoga di
                tengah alam yang asri, seperti Batu, kota Malang dan Gunung
                Bromo.
              </p>
              <p>
                Malang Health Tourism akan menaungi 7-8 Rumah Sakit yang siap
                melayani tindakan medis intensif maupun kegiatan layanan medical
                check up yang dipadu dengan kegiatan wellness di Kota Malang.
              </p>
              <p>
                Menurut Ardantya, Kota Malang berpotensi untuk menjadi sebuah
                "The Healing City".
              </p>
            </div>
          </div>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default About;
