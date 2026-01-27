import { Button } from "@/components/ui/button";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import ContainerWrap from "@/components/utility/ContainerWrap";
import NotFoundContent from "@/components/utility/NotFoundContent";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getInsuranceBySlug } from "@/lib/insurance/get-insurance";
import { cn } from "@/lib/utils";
import { getVendorByID, getVendorBySlug } from "@/lib/vendors/get-vendor";
import { InsuranceType } from "@/types/insurance.types";
import { VendorType } from "@/types/vendor.types";
import { createClient } from "@/utils/supabase/client";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  // const v: InsuranceType = (await getInsuranceBySlug(slug)).data.data;

  let v: InsuranceType | null = null;

  try {
    const res = await getInsuranceBySlug(slug);
    v = res?.data?.data ?? null;
  } catch (error) {
    console.error("Insurance fetch error:", error);
  }

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
            )}&path=${encodeURIComponent(`m-health.id/insurance/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const InsurancePublicDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const supabase = await createClient();

  const locale = await getLocale();

  const { data: user } = await supabase.auth.getUser();

  // const v: InsuranceType = (await getInsuranceBySlug(slug)).data.data;

  let v: InsuranceType | null = null;

  try {
    const res = await getInsuranceBySlug(slug);
    v = res?.data?.data ?? null;
  } catch (error) {
    console.error("Insurance fetch error:", error);
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
          </div>
        </div>

        <p className="text-sm! text-muted-foreground mt-5 mb-2">
          {locale === routing.defaultLocale
            ? "Kategori Asuransi"
            : "Insurance Category"}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {v.category?.map((s, i) => (
            <div
              key={i}
              className={cn(
                "px-3 py-1 bg-transparent border border-primary text-primary rounded-full capitalize truncate inline-flex w-fit",
              )}
            >
              <p className="text-sm!">{s}</p>
            </div>
          ))}
        </div>

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

        <div className="mt-10 mb-2">
          <div className="flex w-full flex-col lg:items-center items-start bg-white px-5 py-7 rounded-4xl">
            <h5 className="text-primary font-semibold mb-1">
              {locale === routing.defaultLocale
                ? "Tertarik dengan asuransi ini?"
                : "Interested in this insurance?"}
            </h5>
            <p className="mb-4">
              {locale === routing.defaultLocale
                ? "Hubungi kami untuk informasi lebih lanjut dan konsultasi gratis."
                : "Contact us for more information and free consultation."}
            </p>
            <Link
              href={`/insurance/${v.slug}/contact`}
              className="flex w-full lg:w-fit"
            >
              <Button className="rounded-full  w-full bg-health text-white hover:bg-health/90 h-12 px-8!">
                <FontAwesomeIcon icon={faWhatsapp} className="size-5" />

                {locale === routing.defaultLocale
                  ? "Hubungi Kami"
                  : "Contact Us"}
              </Button>
            </Link>
          </div>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default InsurancePublicDetailPage;
