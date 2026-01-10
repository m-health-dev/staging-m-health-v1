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
import ClientVendorPublic from "./client-vendor";
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
      locale === routing.defaultLocale
        ? "Mitra Kolaborasi dan Rumah Sakit"
        : "Partner & Hospital Collaboration"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Kami berkolaborasi dengan rumah sakit, pelatih, dan produk ini. Tanpa kolaborasi kami bukan apa-apa."
        : "We are collaboration with this hospital, coach, and product. Without collaboration we're nothing."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale
          ? "Mitra Kolaborasi dan Rumah Sakit"
          : "Partner & Hospital Collaboration"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Kami berkolaborasi dengan rumah sakit, pelatih, dan produk ini. Tanpa kolaborasi kami bukan apa-apa."
          : "We are collaboration with this hospital, coach, and product. Without collaboration we're nothing."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Mitra Kolaborasi dan Rumah Sakit"
              : "Partner & Hospital Collaboration"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Kami berkolaborasi dengan rumah sakit, pelatih, dan produk ini. Tanpa kolaborasi kami bukan apa-apa."
              : "We are collaboration with this hospital, coach, and product. Without collaboration we're nothing."
          )}&path=${encodeURIComponent(`m-health.id/vendor`)}`,
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

  const { data, meta, links } = await getAllVendor(page, per_page);

  const locale = await getLocale();

  const vendor: VendorType[] = data;
  return (
    <Wrapper>
      <ContainerWrap>
        <div className="my-20">
          <h3 className="text-primary font-semibold">
            {locale === routing.defaultLocale
              ? "Mitra Kolaborasi & Rumah Sakit"
              : "Partner & Hospital Collaboration"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "Kami berkolaborasi dengan rumah sakit, pelatih, dan produk ini. Tanpa kolaborasi kami bukan apa-apa."
              : "We are collaboration with this hospital, coach, and product. Without collaboration we're nothing."}
          </p>
        </div>
        <div>
          <ClientVendorPublic
            vendor={vendor}
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
