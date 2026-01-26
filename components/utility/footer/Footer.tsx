import React from "react";
import Image from "next/image";
import { LanguageSwitcher } from "../lang/LanguageSwitcher";
import { useLocale } from "next-intl";
import ContainerWrap from "../ContainerWrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { Diamond } from "lucide-react";
import { routing } from "@/i18n/routing";

const Footer = () => {
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA;
  const deployId = process.env.VERCEL_DEPLOYMENT_ID;
  const locale = useLocale();
  return (
    <footer className="pt-[10vh] bg-white">
      <ContainerWrap>
        <div className="flex flex-wrap lg:flex-row flex-col lg:gap-20 gap-10">
          <div className="3xl:shrink lg:basis-1/4">
            <Link href={`/${locale}/home`}>
              <Image
                src={
                  "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo.PNG"
                }
                width={250}
                height={60}
                className="object-contain"
                alt="M-HEALTH Logo"
              />
            </Link>
            <div className="mt-10">
              <h6 className="font-bold text-primary mb-2">
                PT. Medika Integrasi Persada Indonesia
              </h6>

              <h6 className="font-bold text-primary">
                PT. Medika Integrasi Klinik Indonesia
              </h6>

              <div className="text-muted-foreground mt-4">
                <p>
                  {locale === routing.defaultLocale
                    ? " Jl. Pandan 11A, Gading Kasri, Kec. Klojen, Kota Malang, Jawa Timur 65115"
                    : "Pandan St. 11A, Gading Kasri, Klojen District, Malang City, East Java 65115"}
                </p>
                {/* <p>Menara Kadin 10/29F, HR Rasuna Said, South Jakarta</p> */}
              </div>
              <div className="mt-5">
                <Link href={"mailto:info@m-health.id"}>
                  <div className="inline-flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="size-5.5 text-primary"
                    />
                    <p className="text-muted-foreground">info@m-health.id</p>
                  </div>
                </Link>
              </div>
              <div className="social_media mt-5 flex items-center gap-2">
                <Link href={"whatsapp://send?phone=6282310172457"}>
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="size-6 text-primary"
                  />
                </Link>
                <Link href={"https://facebook.com"}>
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="size-6 text-primary"
                  />
                </Link>
                <Link
                  href={
                    "https://instagram.com/m_health.id?utm_source=m-health.id&utm_medium=footer&utm_campaign=social_media"
                  }
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="size-6 text-primary"
                  />
                </Link>
                <Link href={"https://tiktok.com"}>
                  <FontAwesomeIcon
                    icon={faTiktok}
                    className="size-6 text-primary"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-primary">Menu</h5>

            <div className="space-y-3">
              <p>
                <Link href={"/"}>
                  {locale === routing.defaultLocale
                    ? "Ngobrol dengan AI"
                    : "Chat with AI"}
                </Link>
              </p>
              <p>
                <Link href={"/about"}>
                  {locale === routing.defaultLocale
                    ? "Tentang Kami"
                    : "About Us"}
                </Link>
              </p>

              <p>
                <Link href={"/wellness"}>
                  {locale === routing.defaultLocale
                    ? "Program Kebugaran & Medis"
                    : "Wellness & Medical Programs"}
                </Link>
              </p>

              <p>
                <Link href={"/wellness"}>
                  {locale === routing.defaultLocale
                    ? "Paket Kebugaran"
                    : "Wellness Packages"}
                </Link>
              </p>

              <p>
                <Link href={"/medical"}>
                  {locale === routing.defaultLocale
                    ? "Paket Medis"
                    : "Medical Packages"}
                </Link>
              </p>

              <p>
                <Link href={"/equipment"}>
                  {locale === routing.defaultLocale
                    ? "Alat Kesehatan"
                    : "Medical Products"}
                </Link>
              </p>

              <p>
                <Link href={"/insurance"}>
                  {locale === routing.defaultLocale
                    ? "Produk Asuransi"
                    : "Insurance Products"}{" "}
                </Link>
              </p>

              <p>
                <Link href={"/article"}>
                  {locale === routing.defaultLocale ? "Artikel" : "Articles"}
                </Link>
              </p>

              <p>
                <Link href={"/event"}>
                  {locale === routing.defaultLocale ? "Acara" : "Events"}
                </Link>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-primary">
              {locale === routing.defaultLocale ? "Kerja Sama" : "Partnerships"}
            </h5>

            <div className="space-y-2">
              <p>
                <Link href={"/vendor"}>
                  {locale === routing.defaultLocale
                    ? "Mitra Kolaborasi dan Rumah Sakit"
                    : "Partner & Hospital Partners"}{" "}
                </Link>
              </p>

              <p>
                <Link href={"/hotel"}>
                  {locale === routing.defaultLocale
                    ? "Mitra Hotel"
                    : "Hotel Partners"}{" "}
                </Link>
              </p>

              <p>
                <Link href={"/contact"}>
                  {locale === routing.defaultLocale
                    ? "Menjadi Mitra"
                    : "Become a Partner"}{" "}
                </Link>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-primary">
              {locale === routing.defaultLocale ? "Bantuan" : "Support"}
            </h5>

            <div className="space-y-2">
              <p>
                <Link href={"whatsapp://send?phone=6282310172457"}>
                  {locale === routing.defaultLocale
                    ? "Bantuan Pelanggan"
                    : "Customer Support"}{" "}
                </Link>
              </p>
              <p>
                <Link href={"whatsapp://send?phone=628159880048"}>
                  {locale === routing.defaultLocale
                    ? "Bantuan Teknis"
                    : "Technical Support"}{" "}
                </Link>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-primary">Website</h5>

            <div className="space-y-2">
              <p>
                <Link href={"/privacy"}>
                  {locale === routing.defaultLocale
                    ? "Kebijakan Privasi"
                    : "Privacy Policy"}{" "}
                </Link>
              </p>
              <p>
                <Link href={"/terms"}>
                  {locale === routing.defaultLocale
                    ? "Syarat dan Ketentuan"
                    : "Terms and Conditions"}{" "}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="py-[5vh] flex lg:flex-row flex-col justify-between gap-5 lg:items-center">
          <p className="text-muted-foreground text-sm!">
            &copy; 2025, PT. Medika Integrasi Persada Indonesia. PT. Medika
            Integrasi Klinik Indonesia. M HEALTH.{" "}
            {locale === routing.defaultLocale
              ? "Hak cipta dilindungi oleh undang-undang."
              : "All rights reserved."}
          </p>

          <Link href={"/changelog"}>
            <div className="flex lg:justify-center lg:items-center">
              <div className="flex lg:flex-row flex-col lg:items-center justify-center w-fit rounded-full">
                <p className="text-xs! py-1 pr-3 font-mono italic text-primary opacity-50">
                  v1.0.0@beta-5.1
                </p>
              </div>
            </div>
          </Link>
        </div>
        {/* <div className="flex justify-center pb-[5vh]">
          <Link href={"/sandbox"}>
            <p className="bg-health py-1 px-3 text-white rounded-full inline-flex items-center gap-2 hover:scale-105 transition-transform group shadow-lg shadow-health/30">
              <Diamond className="size-4 group-hover:rotate-45 transition-all duration-200" />{" "}
              Sandbox
            </p>
          </Link>
        </div> */}
      </ContainerWrap>
    </footer>
  );
};

export default Footer;
