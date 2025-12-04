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
          <h3 className="text-primary font-semibold">Vendor Collaboration</h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            We are collaboration with this hospital, coach, and product. Without
            collaboration we're nothing.
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
