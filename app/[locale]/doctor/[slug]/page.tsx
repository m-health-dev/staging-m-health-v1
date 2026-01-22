import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import ContainerWrap from "@/components/utility/ContainerWrap";
import UnderConstruction from "@/components/utility/under-construction";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getDoctorsBySlug } from "@/lib/doctor/get-doctor";
import { cn } from "@/lib/utils";
import { getVendorByID, getVendorBySlug } from "@/lib/vendors/get-vendor";
import { DoctorType } from "@/types/doctor.types";
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

  const v: DoctorType = (await getDoctorsBySlug(slug)).data.data;

  const rawContent = locale === routing.defaultLocale ? v.id_bio : v.en_bio;
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
            v.photo_url ||
            `/api/og?title=${encodeURIComponent(
              v.name,
            )}&description=${encodeURIComponent(
              plainDescription,
            )}&path=${encodeURIComponent(`m-health.id/doctor/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const DoctorPublicDetailPage = async ({
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

  const v: DoctorType = (await getDoctorsBySlug(slug)).data.data;
  return (
    <Wrapper>
      <ContainerWrap size="md" className="mb-[20vh] mt-20">
        <div className="flex flex-col gap-5 w-full">
          <Image
            src={v.photo_url}
            width={720}
            height={720}
            alt={v.name}
            className="aspect-square w-42 h-42 rounded-full object-center object-cover border"
          />
          <h3 className="text-health font-bold lg:mb-0 mb-4">{v.name}</h3>
        </div>
        <p className="text-sm! text-muted-foreground mt-10 mb-2">
          {locale === routing.defaultLocale ? "Spesialis" : "Specialties"}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {v.specialty?.map((s, i) => (
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
            className="prose max-w-none font-sans"
            dangerouslySetInnerHTML={{
              __html: locale === routing.defaultLocale ? v.id_bio : v.en_bio,
            }}
          />
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default DoctorPublicDetailPage;
