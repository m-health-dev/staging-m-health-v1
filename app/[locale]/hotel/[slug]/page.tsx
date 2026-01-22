import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getHotelBySlug } from "@/lib/hotel/get-hotel";
import { cn } from "@/lib/utils";
import { getVendorByID, getVendorBySlug } from "@/lib/vendors/get-vendor";
import { HotelType } from "@/types/hotel.types";
import { VendorType } from "@/types/vendor.types";
import { createClient } from "@/utils/supabase/client";
import { MapPin } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  const v: HotelType = (await getHotelBySlug(slug)).data.data;

  const rawContent =
    locale === routing.defaultLocale ? v.id_description : v.en_description;

  const plainDescription = stripHtml(rawContent);

  return {
    title: `${v.name} - M HEALTH`,
    description: `${plainDescription}`,
    openGraph: {
      title: `${v.name} - M HEALTH`,
      description: `${plainDescription}`,
      images: [
        {
          url:
            v.highlight_image ||
            `/api/og?title=${encodeURIComponent(
              v.name,
            )}&description=${encodeURIComponent(
              plainDescription,
            )}&path=${encodeURIComponent(`m-health.id/hotel/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const HotelPublicDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  const supabase = await createClient();

  const locale = await getLocale();

  const v: HotelType = (await getHotelBySlug(slug)).data.data;
  return (
    <Wrapper>
      <ContainerWrap className="mt-10">
        <Image
          src={v.highlight_image}
          width={720}
          height={405}
          alt={v.slug}
          unoptimized
          className="lg:aspect-20/7 aspect-video w-full rounded-2xl object-center object-cover"
        />
      </ContainerWrap>
      <ContainerWrap size="md" className="mb-20">
        <div className=" flex  items-center lg:-mt-12 -mt-6 w-full z-10">
          <div className="bg-linear-to-b from-white via-white to-transparent flex lg:flex-row flex-col lg:items-center items-start lg:gap-5 gap-0 justify-between w-full rounded-2xl lg:px-6 px-4 py-8">
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
                <p className="block">{locale === routing.defaultLocale ? "Lokasi" : "Location"}</p>
              </div>
            </Link>
          </div>
        </div>

        {v.location && (
          <>
            <p className="text-sm! text-muted-foreground mt-10 mb-2">
              {locale === routing.defaultLocale ? "Lokasi" : "Location"}
            </p>

            <p className="mb-5">{v.location}</p>
          </>
        )}
        <p className="text-sm! text-muted-foreground mt-10 mb-2">{locale === routing.defaultLocale ? "Tentang" : "About"}</p>
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
        {v.reference_image.length > 0 && (
          <>
            <p className="text-sm! text-muted-foreground mt-10 mb-2">
              {locale === routing.defaultLocale ? "Galeri" : "Gallery"}
            </p>
            <div className="md:grid lg:grid-cols-3 md:grid-cols-2 flex flex-col gap-5">
              {v.reference_image.map((r, i) => (
                <div key={r}>
                  <ImageZoom>
                    <Image
                      src={r}
                      width={720}
                      height={405}
                      alt={r}
                      className="aspect-video object-center object-cover rounded-2xl"
                    />
                  </ImageZoom>
                </div>
              ))}
            </div>
          </>
        )}
      </ContainerWrap>
    </Wrapper>
  );
};

export default HotelPublicDetailPage;
