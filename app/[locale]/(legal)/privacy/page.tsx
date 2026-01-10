import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import {
  getLatestPrivacyPolicy,
  getLatestTermsOfService,
} from "@/lib/legal/get-legal";
import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  return {
    title: `${
      locale === routing.defaultLocale ? "Kebijakan Privasi" : "Privacy Policy"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Pemberitahuan Privasi ini menjelaskan bagaimana kami, PT. Medika Integrasi Persada & PT. Medika Integrasi Klinik Indonesia (M HEALTH) (selanjutnya disebut “kami”), memperoleh, mengumpulkan, menyimpan, menguasai, menggunakan, mengolah, menganalisis, memperbaiki, melakukan pembaruan, menampilkan, mengumumkan, mentransfer, mengungkapkan, dan melindungi Data Pribadi Anda."
        : "This Privacy Notice explains how we, PT. Medika Integrasi Persada & PT. Medika Integrasi Klinik Indonesia (M HEALTH) (hereinafter referred to as “we”), obtain, collect, store, control, use, process, analyze, correct, update, display, announce, transfer, disclose, and protect your Personal Data. "
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale
          ? "Kebijakan Privasi"
          : "Privacy Policy"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Pemberitahuan Privasi ini menjelaskan bagaimana kami, PT. Medika Integrasi Persada & PT. Medika Integrasi Klinik Indonesia (M HEALTH) (selanjutnya disebut “kami”), memperoleh, mengumpulkan, menyimpan, menguasai, menggunakan, mengolah, menganalisis, memperbaiki, melakukan pembaruan, menampilkan, mengumumkan, mentransfer, mengungkapkan, dan melindungi Data Pribadi Anda."
          : "This Privacy Notice explains how we, PT. Medika Integrasi Persada & PT. Medika Integrasi Klinik Indonesia (M HEALTH) (hereinafter referred to as “we”), obtain, collect, store, control, use, process, analyze, correct, update, display, announce, transfer, disclose, and protect your Personal Data. "
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Kebijakan Privasi"
              : "Privacy Policy"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Pemberitahuan Privasi ini menjelaskan bagaimana kami, PT. Medika Integrasi Persada & PT. Medika Integrasi Klinik Indonesia (M HEALTH) (selanjutnya disebut “kami”), memperoleh, mengumpulkan, menyimpan, menguasai, menggunakan, mengolah, menganalisis, memperbaiki, melakukan pembaruan, menampilkan, mengumumkan, mentransfer, mengungkapkan, dan melindungi Data Pribadi Anda."
              : "This Privacy Notice explains how we, PT. Medika Integrasi Persada & PT. Medika Integrasi Klinik Indonesia (M HEALTH) (hereinafter referred to as “we”), obtain, collect, store, control, use, process, analyze, correct, update, display, announce, transfer, disclose, and protect your Personal Data. "
          )}&path=${encodeURIComponent("m-health.id/privacy")}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const PrivacyPage = async () => {
  const { data: privacy } = (await getLatestPrivacyPolicy()).data;
  const locale = await getLocale();
  return (
    <Wrapper>
      <ContainerWrap size="lg" className="py-10">
        <h1 className="text-3xl font-bold text-primary mb-5 mt-10">
          {locale === "en" ? "Privacy Policy" : "Kebijakan Privasi"}
        </h1>

        <p className="mb-20 text-muted-foreground">
          {locale === routing.defaultLocale
            ? "Terakhir diperbarui pada"
            : "Last updated at"}{" "}
          <LocalDateTime date={privacy.updated_at} />
        </p>

        <div
          className="prose max-w-none font-sans"
          dangerouslySetInnerHTML={{
            __html:
              locale === routing.defaultLocale
                ? privacy.id_content
                : privacy.en_content,
          }}
        />
      </ContainerWrap>
    </Wrapper>
  );
};

export default PrivacyPage;
