import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { getLatestTermsOfService } from "@/lib/legal/get-legal";
import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
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

  return {
    title: `${
      locale === routing.defaultLocale
        ? "Syarat dan Ketentuan Layanan"
        : "Terms of Service"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Syarat dan Ketentuan ini berlaku untuk akses dan penggunaan Anda atas situs web, produk, dan layanan daring lainnya (secara kolektif, “Layanan”) yang disediakan oleh PT. Medika Integrasi Persada Indonesia & PT. Medika Integrasi Klinik Persada (M-HEALTH) (selanjutnya disebut “kami”)."
        : "These Terms and Conditions apply to your access and use of the website, products, and other online services (collectively, the “Services”) provided by PT. Medika Integrasi Persada Indonesia & PT. Medika Integrasi Klinik Persada (M-HEALTH) (hereinafter referred to as “we”). "
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale
          ? "Syarat dan Ketentuan Layanan"
          : "Terms of Service"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Syarat dan Ketentuan ini berlaku untuk akses dan penggunaan Anda atas situs web, produk, dan layanan daring lainnya (secara kolektif, “Layanan”) yang disediakan oleh PT. Medika Integrasi Persada Indonesia & PT. Medika Integrasi Klinik Persada (M-HEALTH) (selanjutnya disebut “kami”)."
          : "These Terms and Conditions apply to your access and use of the website, products, and other online services (collectively, the “Services”) provided by PT. Medika Integrasi Persada Indonesia & PT. Medika Integrasi Klinik Persada (M-HEALTH) (hereinafter referred to as “we”). "
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Syarat dan Ketentuan Layanan"
              : "Terms of Service",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Syarat dan Ketentuan ini berlaku untuk akses dan penggunaan Anda atas situs web, produk, dan layanan daring lainnya (secara kolektif, “Layanan”) yang disediakan oleh PT. Medika Integrasi Persada Indonesia & PT. Medika Integrasi Klinik Persada (M-HEALTH) (selanjutnya disebut “kami”)."
              : "These Terms and Conditions apply to your access and use of the website, products, and other online services (collectively, the “Services”) provided by PT. Medika Integrasi Persada Indonesia & PT. Medika Integrasi Klinik Persada (M-HEALTH) (hereinafter referred to as “we”). ",
          )}&path=${encodeURIComponent("m-health.id/terms")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const TermsPage = async () => {
  const { data: terms } = (await getLatestTermsOfService()).data;
  const locale = await getLocale();
  return (
    <Wrapper>
      <ContainerWrap size="lg" className="py-10">
        <h1 className="text-3xl font-bold text-primary mb-5 mt-10">
          {locale === routing.defaultLocale ? "Syarat Layanan" : "Terms of Service"}
        </h1>

        <p className="mb-20 text-muted-foreground">
          {locale === routing.defaultLocale
            ? "Terakhir diperbarui pada"
            : "Last updated at"}{" "}
          <LocalDateTime date={terms.updated_at} />
        </p>

        <div
          className="prose max-w-none font-sans"
          dangerouslySetInnerHTML={{
            __html:
              locale === routing.defaultLocale
                ? terms.id_content
                : terms.en_content,
          }}
        />
      </ContainerWrap>
    </Wrapper>
  );
};

export default TermsPage;
