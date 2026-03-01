import { getInsuranceBySlug } from "@/lib/insurance/get-insurance";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { InsuranceType } from "@/types/insurance.types";
import { WhatsAppRedirect } from "./WhatsAppRedirect";
import { baseUrl } from "@/helper/baseUrl";

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

  const v: InsuranceType = (await getInsuranceBySlug(slug)).data.data;

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
            )}&path=${encodeURIComponent(`m-health.id/insurance/${slug}/contact`)}`,
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
  params: { slug: string };
}) => {
  const { slug } = await params;
  const locale = await getLocale();
  const insuranceRes = await getInsuranceBySlug(slug);
  const v = insuranceRes?.data?.data;
  if (!v) {
    // Optional: handle not found, redirect or show error
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="text-lg text-destructive font-semibold mb-2">
          Data asuransi tidak ditemukan.
        </p>
      </div>
    );
  }

  // Compose WhatsApp message
  const intro =
    locale === routing.defaultLocale
      ? `Halo, saya tertarik dengan produk asuransi ini, mohon bantuannya untuk detail informasi tentang asuransi dibawah ini:\n`
      : `Hello, I am interested in this insurance product, please assist me with detailed information about the insurance below:\n`;
  const slugData =
    v.slug && v.slug ? `\n${baseUrl + "/insurance/" + v.slug}` : "";
  const name = v.name ? `\n${v.name}` : "";
  const category =
    v.category && v.category.length ? `\n${v.category.join(", ")}` : "";
  const desc =
    locale === routing.defaultLocale ? v.id_description : v.en_description;
  const plainDesc = desc ? `\n${stripHtml(desc)}` : "";
  const msg = `${intro}${name}${slugData}${category}${plainDesc}`;
  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/628113061173?text=${encodedMsg}`;

  // Render loading and redirect on client
  return <WhatsAppRedirect waUrl={waUrl} locale={locale} />;
};

export default InsurancePublicDetailPage;
