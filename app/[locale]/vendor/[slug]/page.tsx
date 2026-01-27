import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import AvatarInsurance from "@/components/utility/AvatarInsurance";
import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getVendorByID, getVendorBySlug } from "@/lib/vendors/get-vendor";
import { VendorType } from "@/types/vendor.types";
import { createClient } from "@/utils/supabase/client";
import Avatar from "boring-avatars";
import { MapPin } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NotFound from "../../not-found";
import NotFoundContent from "@/components/utility/NotFoundContent";

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

  // const v: VendorType = (await getVendorBySlug(slug)).data.data;

  let v: VendorType | null = null;

  try {
    const res = await getVendorBySlug(slug);
    v = res?.data?.data ?? null;
  } catch (error) {
    console.error("Vendor fetch error:", error);
  }

  // 🔥 kalau data ga ada → 404 page, bukan 500
  if (!v) {
    return {};
  }

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
            )}&path=${encodeURIComponent(`m-health.id/vendor/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

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

  // const v: VendorType = (await getVendorBySlug(slug)).data.data;

  let v: VendorType | null = null;

  try {
    const res = await getVendorBySlug(slug);
    v = res?.data?.data ?? null;
  } catch (error) {
    console.error("Vendor fetch error:", error);
  }

  if (!v) {
    return <NotFoundContent messageNoData />;
  }

  return (
    <Wrapper>
      <ContainerWrap className="mt-10">
        <Image
          src={v.highlight_image}
          width={720}
          height={405}
          alt={v.slug}
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
                <p className="block">
                  {locale === routing.defaultLocale ? "Lokasi" : "Location"}
                </p>
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

        <p className="text-sm! text-muted-foreground mt-10 mb-2">
          {locale === routing.defaultLocale ? "Spesialis" : "Specialist"}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {v.specialist?.map((s, i) => (
            <div
              key={i}
              className={cn(
                "px-3 py-1 bg-transparent border border-health text-health rounded-full capitalize truncate inline-flex w-fit",
              )}
            >
              <p className="text-sm!">{s}</p>
            </div>
          ))}
        </div>

        {v.insurance_id.length > 0 && (
          <>
            <p className="text-sm! text-muted-foreground mt-10 mb-2">
              {locale === routing.defaultLocale ? "Asuransi" : "Insurance"}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {v.insurance_id?.map((s, i) => (
                <div
                  className="inline-flex bg-white pl-2 pr-4 py-2 rounded-full border border-primary"
                  key={i}
                >
                  <AvatarInsurance
                    key={i}
                    insurance={s}
                    size="md"
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-sm! text-muted-foreground mt-10 mb-2">
          {locale === routing.defaultLocale ? "Tentang" : "About"}
        </p>
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

        {/* <pre>{JSON.stringify(v, null, 2)}</pre> */}
      </ContainerWrap>
    </Wrapper>
  );
};

export default VendorPublicDetailPage;
