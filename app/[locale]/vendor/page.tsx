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

const VendorPublicPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
              ? "Partner & Hospital Collaboration"
              : "Mitra Kolaborasi & Rumah Sakit"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "We are collaboration with this hospital, coach, and product. Without collaboration we're nothing."
              : "Kami berkolaborasi dengan rumah sakit, pelatih, dan produk ini. Tanpa kolaborasi kami bukan apa-apa."}
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
