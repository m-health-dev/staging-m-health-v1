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
import ClientVendorPublic from "./client-hotel";
import ClientHotelPublic from "./client-hotel";
import { getAllHotel } from "@/lib/hotel/get-hotel";
import { HotelType } from "@/types/hotel.types";
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";

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
      locale === routing.defaultLocale ? "Mitra Hotel" : "Hotel Partners"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Kami berkolaborasi dengan hotel ini. Untuk memberikan Anda perjalanan kebugaran yang sempurna."
        : "We are collaboration with this hotel. To give you the perfect journey of wellness."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Mitra Hotel" : "Hotel Partners"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Kami berkolaborasi dengan hotel ini. Untuk memberikan Anda perjalanan kebugaran yang sempurna."
          : "We are collaboration with this hotel. To give you the perfect journey of wellness."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Mitra Hotel" : "Hotel Partners"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Kami berkolaborasi dengan hotel ini. Untuk memberikan Anda perjalanan kebugaran yang sempurna."
              : "We are collaboration with this hotel. To give you the perfect journey of wellness."
          )}&path=${encodeURIComponent(`m-health.id/hotel`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const HotelPublicPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 9);

  const { data, meta, links } = await getAllHotel(page, per_page);

  const locale = await getLocale();

  const hotel: HotelType[] = data;
  return (
    <Wrapper>
      <ContainerWrap>
        <div className="my-20">
          <h3 className="text-primary font-semibold">
            {locale === routing.defaultLocale
              ? "Mitra Hotel"
              : "Hotel Partners"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "Kami berkolaborasi dengan hotel ini. Untuk memberikan Anda perjalanan kebugaran yang sempurna."
              : "We collaborate with these hotels to provide you with the perfect wellness journey."}
          </p>
        </div>
        <div>
          <ClientHotelPublic
            hotel={hotel}
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

export default HotelPublicPage;
