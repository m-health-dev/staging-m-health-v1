import React from "react";

import { ConsultScheduleType } from "@/types/consult.types";

import { getLocale } from "next-intl/server";

import ContainerWrap from "@/components/utility/ContainerWrap";

import { getAllConsultations } from "@/lib/consult/get-consultation";
import LiveConsultSchedule from "./LiveConsultSchedule";

const ConsultScheduleStudio = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const { data, meta, links, total } = await getAllConsultations(
    page,
    per_page,
  ); // nanti page bisa dynamic

  const locale = await getLocale();

  return (
    <ContainerWrap className="pb-[20vh]">
      <div className="my-10 flex items-center justify-between gap-5 sticky top-0 bg-linear-to-b from-background via-background z-20 py-5 w-full">
        <div className="flex flex-col w-full">
          <h4 className="text-primary font-semibold">
            Consultation Schedule Data
          </h4>
        </div>
        {/* <Link href={`/${locale}/consult/schedule/add`}>
          <Button className="rounded-2xl flex lg:w-fit w-full">
            <Plus /> <p className="lg:block hidden">Add New Schedule</p>
          </Button>
        </Link> */}
      </div>

      <LiveConsultSchedule
        initialData={(data ?? []) as ConsultScheduleType[]}
        page={page}
        per_page={per_page}
        meta={meta}
        links={links}
        locale={locale}
      />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </ContainerWrap>
  );
};

export default ConsultScheduleStudio;
