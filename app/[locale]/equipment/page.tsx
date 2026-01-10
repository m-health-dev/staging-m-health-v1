import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React, { Suspense } from "react";

import { getLocale, getTranslations } from "next-intl/server";
import {
  getAllPackages,
  getAllPublicPackages,
} from "@/lib/packages/get-packages";
import { PackageType } from "@/types/packages.types";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Skeleton } from "@/components/ui/skeleton";
import PackageClientPage from "./euipment-page-client";
import Wrapper from "@/components/utility/Wrapper";
import { routing } from "@/i18n/routing";
import { getAllPublicMedicalEquipment } from "@/lib/medical-equipment/get-medical-equipment";
import EquipmentClientPage from "./euipment-page-client";

const EquipmentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const locale = await getLocale();
  return (
    <Wrapper>
      <div className="font-bold text-white mb-20 pt-40 pb-20 -mt-28 text-center bg-primary rounded-b-4xl shadow-[inset_0px_-10px_10px_-2px_rgba(0,0,0,0.1)]">
        <ContainerWrap>
          <h1>
            {locale === routing.defaultLocale
              ? "Alat Kesehatan"
              : "Health Equipment"}
          </h1>
        </ContainerWrap>
      </div>{" "}
      <ContainerWrap>
        <Suspense fallback={<SkeletonComponent per_page={per_page} />}>
          <Content
            params={params}
            page={page}
            per_page={per_page}
            locale={locale}
          />
        </Suspense>
      </ContainerWrap>
    </Wrapper>
  );
};

export default EquipmentPage;

const SkeletonComponent = ({ per_page }: { per_page: number }) => {
  return (
    <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 pb-20">
      {[...Array(per_page)].map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
      ))}
    </div>
  );
};

const Content = async ({
  params,
  page,
  per_page,
  locale,
}: {
  params: { [key: string]: string | string[] | undefined };
  page: number;
  per_page: number;
  locale: string;
}) => {
  const { data, total, links, meta } = await getAllPublicMedicalEquipment(
    page,
    per_page
  ); // nanti page bisa dynamic

  const equipment = Array.isArray(data) ? data : [];

  const t = await getTranslations("utility");
  return (
    <EquipmentClientPage
      equipment={equipment}
      locale={locale}
      labels={{
        days: t("days"),
        night: t("night"),
      }}
      meta={meta}
      links={links}
    />
  );
};
