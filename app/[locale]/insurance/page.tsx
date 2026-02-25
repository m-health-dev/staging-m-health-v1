import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getLocale } from "next-intl/server";
import React, { Suspense } from "react";
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";
import { getAllInsurance } from "@/lib/insurance/get-insurance";
import { InsuranceType } from "@/types/insurance.types";
import ClientInsurancePublic from "./client-insurance";
import { Skeleton } from "@/components/ui/skeleton";

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
      locale === routing.defaultLocale ? "Asuransi" : "Insurance"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Kami berkolaborasi dengan perusahaan asuransi untuk memberikan perlindungan terbaik. Tanpa kolaborasi kami bukan apa-apa."
        : "We collaborate with insurance companies to provide the best protection. Without collaboration we're nothing."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Asuransi" : "Insurance"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Kami berkolaborasi dengan perusahaan asuransi untuk memberikan perlindungan terbaik. Tanpa kolaborasi kami bukan apa-apa."
          : "We collaborate with insurance companies to provide the best protection. Without collaboration we're nothing."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Asuransi" : "Insurance",
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Kami berkolaborasi dengan perusahaan asuransi untuk memberikan perlindungan terbaik. Tanpa kolaborasi kami bukan apa-apa."
              : "We collaborate with insurance companies to provide the best protection. Without collaboration we're nothing.",
          )}&path=${encodeURIComponent(`m-health.id/vendor`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const InsurancePublicPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 9);

  const locale = await getLocale();
  return (
    <Wrapper>
      <ContainerWrap>
        <div className="my-20">
          <h3 className="text-primary font-semibold">
            {locale === routing.defaultLocale ? "Asuransi" : "Insurance"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "Kami memiliki beberapa produk asuransi untuk memberikan perlindungan terbaik. Dengan asuransi, Anda dapat merasa lebih aman dan tenang dalam menjalani hidup."
              : "We have several insurance products to provide the best protection. With insurance, you can feel safer and more at ease in living your life."}
          </p>
        </div>
        <Suspense fallback={<InsuranceSkeleton perPage={per_page} />}>
          <InsuranceContent page={page} perPage={per_page} locale={locale} />
        </Suspense>
      </ContainerWrap>
    </Wrapper>
  );
};

export default InsurancePublicPage;

const InsuranceSkeleton = ({ perPage }: { perPage: number }) => (
  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 pb-20">
    {[...Array(perPage)].map((_, i) => (
      <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
    ))}
  </div>
);

const InsuranceContent = async ({
  page,
  perPage,
  locale,
}: {
  page: number;
  perPage: number;
  locale: string;
}) => {
  const { data, meta, links } = await getAllInsurance(page, perPage);
  const insurance: InsuranceType[] = data;
  return (
    <div>
      <ClientInsurancePublic
        insurance={insurance}
        meta={meta}
        locale={locale}
        links={links}
        perPage={perPage}
      />
    </div>
  );
};
