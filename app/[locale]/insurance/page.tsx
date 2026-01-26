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
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";
import { getAllInsurance } from "@/lib/insurance/get-insurance";
import { InsuranceType } from "@/types/insurance.types";
import ClientInsurancePublic from "./client-insurance";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  return {
    title: `${
      locale === routing.defaultLocale ? "Asuransi" : "Insurance"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Kami berkolaborasi dengan perusahaan asuransi untuk memberikan perlindungan terbaik. Tanpa kolaborasi kami bukan apa-apa."
        : "We collaborate with insurance companies to provide the best protection. Without collaboration we're nothing."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Asuransi" : "Insurance"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Kami berkolaborasi dengan perusahaan asuransi untuk memberikan perlindungan terbaik. Tanpa kolaborasi kami bukan apa-apa."
          : "We collaborate with insurance companies to provide the best protection. Without collaboration we're nothing."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Asuransi" : "Insurance",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Kami berkolaborasi dengan perusahaan asuransi untuk memberikan perlindungan terbaik. Tanpa kolaborasi kami bukan apa-apa."
              : "We collaborate with insurance companies to provide the best protection. Without collaboration we're nothing.",
          )}&path=${encodeURIComponent(`m-health.id/vendor`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const InsurancePublicPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 9);

  const { data, meta, links } = await getAllInsurance(page, per_page);

  const locale = await getLocale();

  const insurance: InsuranceType[] = data;
  return (
    <Wrapper>
      <ContainerWrap>
        <div className="my-20">
          <h3 className="text-primary font-semibold">
            {locale === routing.defaultLocale ? "Asuransi" : "Insurance"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "Kami memiliki beberapa produk asuransi untuk memberikan perlindungan terbaik. Dengan asuransi, Anda dapat merasa lebih aman dan tenang dalam menjalani hidup."
              : "We have several insurance products to provide the best protection. With insurance, you can feel safer and more at ease in living your life."}
          </p>
        </div>
        <div>
          <ClientInsurancePublic
            insurance={insurance}
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

export default InsurancePublicPage;
