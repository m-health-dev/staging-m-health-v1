import ContainerWrap from "@/components/utility/ContainerWrap";
import SimplePagination from "@/components/utility/simple-pagination";
import Wrapper from "@/components/utility/Wrapper";
import { cn } from "@/lib/utils";
import { getAllVendor } from "@/lib/vendors/get-vendor";
import { VendorType } from "@/types/vendor.types";
import Avatar from "boring-avatars";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ClientVendorPublic from "./client-doctor";
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";
import ClientDoctorPublic from "./client-doctor";
import { DoctorType } from "@/types/doctor.types";
import { getAllAvailableDoctors } from "@/lib/doctor/get-doctor";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  return {
    title: `${
      locale === routing.defaultLocale ? "Dokter" : "Doctor"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Dokter kami siap melayani anda."
        : "Our doctors are ready to serve you."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Dokter" : "Doctor"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Dokter kami siap melayani anda."
          : "Our doctors are ready to serve you."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Dokter" : "Doctor"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Dokter kami siap melayani anda."
              : "Our doctors are ready to serve you."
          )}&path=${encodeURIComponent(`m-health.id/doctor`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const VendorPublicPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 9);

  const { data, meta, links } = await getAllAvailableDoctors(page, per_page);

  const locale = await getLocale();

  const doctor: DoctorType[] = data;
  return (
    <Wrapper>
      <ContainerWrap>
        <div className="my-20">
          <h3 className="text-primary font-semibold">
            {locale === routing.defaultLocale ? "Dokter Kami" : "Our Doctors"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "Dokter kami siap melayani anda."
              : "Our doctors are ready to serve you."}
          </p>
        </div>
        <div>
          <ClientDoctorPublic
            doctor={doctor}
            meta={meta}
            locale={locale}
            links={links}
            perPage={per_page}
          />
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default VendorPublicPage;
