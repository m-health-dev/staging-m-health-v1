import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getLocale } from "next-intl/server";
import React, { Suspense } from "react";
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";
import ClientDoctorPublic from "./client-doctor";
import { DoctorType } from "@/types/doctor.types";
import { getAllAvailableDoctors } from "@/lib/doctor/get-doctor";
import { Skeleton } from "@/components/ui/skeleton";

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
      locale === routing.defaultLocale ? "Dokter" : "Doctor"
    } - M HEALTH`,
    description: `${
      locale === routing.defaultLocale
        ? "Dokter kami siap melayani anda."
        : "Our doctors are ready to serve you."
    }`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? "Dokter" : "Doctor"
      } - M HEALTH`,
      description: `${
        locale === routing.defaultLocale
          ? "Dokter kami siap melayani anda."
          : "Our doctors are ready to serve you."
      }`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? "Dokter" : "Doctor"
          )}&description=${encodeURIComponent(
            locale === routing.defaultLocale
              ? "Dokter kami siap melayani anda."
              : "Our doctors are ready to serve you."
          )}&path=${encodeURIComponent(`m-health.id/doctor`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const DoctorPublicPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 9);

  const locale = await getLocale();
  return (
    <Wrapper>
      <ContainerWrap>
        <div className="my-20">
          <h3 className="text-primary font-semibold">
            {locale === routing.defaultLocale ? "Dokter Kami" : "Our Doctors"}
          </h3>
          <p className="text-muted-foreground max-w-xl mt-1 text-sm!">
            {locale === routing.defaultLocale
              ? "Dokter kami siap melayani anda."
              : "Our doctors are ready to serve you."}
          </p>
        </div>
        <Suspense fallback={<DoctorSkeleton perPage={per_page} />}>
          <DoctorContent page={page} perPage={per_page} locale={locale} />
        </Suspense>
      </ContainerWrap>
    </Wrapper>
  );
};

export default DoctorPublicPage;

const DoctorSkeleton = ({ perPage }: { perPage: number }) => (
  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 pb-20">
    {[...Array(perPage)].map((_, i) => (
      <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
    ))}
  </div>
);

const DoctorContent = async ({
  page,
  perPage,
  locale,
}: {
  page: number;
  perPage: number;
  locale: string;
}) => {
  const { data, meta, links } = await getAllAvailableDoctors(page, perPage);
  const doctor: DoctorType[] = data;
  return (
    <div>
      <ClientDoctorPublic
        doctor={doctor}
        meta={meta}
        locale={locale}
        links={links}
        perPage={perPage}
      />
    </div>
  );
};
