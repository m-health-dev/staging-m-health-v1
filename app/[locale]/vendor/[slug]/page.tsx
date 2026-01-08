import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getVendorByID, getVendorBySlug } from "@/lib/vendors/get-vendor";
import { VendorType } from "@/types/vendor.types";
import { createClient } from "@/utils/supabase/client";
import { MapPin } from "lucide-react";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const VendorPublicDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const supabase = await createClient();

  const locale = await getLocale();

  const { data, error } = await supabase
    .from("vendor")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const v: VendorType = (await getVendorBySlug(slug)).data.data;
  return (
    <Wrapper>
      <ContainerWrap className="mt-10">
        <Image
          src={v.highlight_image}
          width={720}
          height={405}
          alt={v.slug}
          className="lg:aspect-13/4 aspect-video w-full rounded-2xl object-center object-cover"
        />
      </ContainerWrap>
      <ContainerWrap size="md" className="mb-20">
        <div className=" flex  items-center lg:-mt-12 -mt-6 w-full z-10">
          <div className="bg-white flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-0 justify-between w-full rounded-2xl p-4">
            <div className="inline-flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-0">
              <Image
                src={v.logo}
                width={720}
                height={405}
                alt={v.name}
                className="aspect-square w-15 h-15 rounded-full object-center object-cover border"
              />
              <h4 className="text-health font-bold lg:mb-0 mb-4">{v.name}</h4>
            </div>
            <Link href={v.location_map}>
              <div className="inline-flex items-center gap-1 bg-health text-white lg:px-4 px-2 py-2 lg:w-fit lg:h-fit rounded-full">
                <MapPin className="size-5" />
                <p className="block">Location</p>
              </div>
            </Link>
          </div>
        </div>
        <p className="text-sm! text-muted-foreground mt-10 mb-2">Specialist</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {v.specialist?.map((s, i) => (
            <div
              key={i}
              className={cn(
                "px-3 py-1 bg-transparent border border-health text-health rounded-full capitalize truncate inline-flex w-fit"
              )}
            >
              <p className="text-sm!">{s}</p>
            </div>
          ))}
        </div>

        <p className="text-sm! text-muted-foreground mt-10 mb-2">About</p>
        <div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                locale === routing.defaultLocale
                  ? v.id_description
                  : v.en_description,
            }}
          />
        </div>

        <p className="text-sm! text-muted-foreground mt-10 mb-2">Gallery</p>
        <div className="md:grid lg:grid-cols-3 md:grid-cols-2 flex flex-col gap-5">
          {v.reference_image.map((r, i) => (
            <div key={r}>
              <Image
                src={r}
                width={720}
                height={405}
                alt={r}
                className="aspect-video object-center object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default VendorPublicDetailPage;
