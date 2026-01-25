import { getAllVendor } from "@/lib/vendors/get-vendor";
import { Account } from "@/types/account.types";
import React from "react";
import { columns } from "./columns";
import { VendorType } from "@/types/vendor.types";
import { ConsultScheduleType } from "@/types/consult.types";
import Link from "next/link";
import { ChevronDown, ChevronRight, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { getAllHotel } from "@/lib/hotel/get-hotel";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { VendorHotelDataTable } from "@/components/vendor-hotel/vendor-hotel-data-table";
import { deleteHotel } from "@/lib/hotel/delete-hotel";
import { getAllConsultations } from "@/lib/consult/get-consultation";
import LiveConsultSchedule from "./LiveConsultSchedule";
import { deleteConsultation } from "@/lib/consult/delete-consultation";

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

  const supabase = await createClient();

  const { count: countHotel } = await supabase
    .from("hotel")
    .select("*", { count: "exact" });

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
