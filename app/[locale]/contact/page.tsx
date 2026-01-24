import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import React from "react";
import z from "zod";
import ContactPageClient from "./contact-page-client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import type { Metadata, ResolvingMetadata } from "next";

export const metadata: Metadata = {
  title: `Contact Us- M HEALTH`,
  description: `Pandan St. 11A, Gading Kasri, Klojen District, Malang City, East Java 65115 | info@m-health.id`,
  openGraph: {
    title: `Contact Us - M HEALTH`,
    description: `Pandan St. 11A, Gading Kasri, Klojen District, Malang City, East Java 65115 | info@m-health.id`,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(
          "Contact Us",
        )}&description=${encodeURIComponent(
          "Pandan St. 11A, Gading Kasri, Klojen District, Malang City, East Java 65115 | info@m-health.id",
        )}&path=${encodeURIComponent("m-health.id/contact")}`,
        width: 800,
        height: 450,
      },
    ],
  },
};

const ContactPage = async () => {
  const locale = await getLocale();
  return (
    <Wrapper>
      <ContainerWrap className="mb-[10vh]">
        <h1 className="text-primary text-center my-20 font-bold">
          {locale === routing.defaultLocale ? "Kontak" : "Contact Us"}
        </h1>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
          <div className="bg-white rounded-2xl border p-4 h-fit">
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
              <h6 className="font-bold text-primary">
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
          <ContactPageClient />
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default ContactPage;
