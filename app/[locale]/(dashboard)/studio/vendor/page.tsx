import { getAllVendor } from "@/lib/vendors/get-vendor";
import { Account } from "@/types/account.types";
import React from "react";
import { columns } from "./columns";
import { VendorType } from "@/types/vendor.types";
import Link from "next/link";
import { ChevronDown, ChevronRight, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { VendorHotelDataTable } from "@/components/vendor-hotel/vendor-hotel-data-table";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { deleteVendor } from "@/lib/vendors/delete-vendor";
import Loading from "./loading";
import SearchOnAll from "./serach-on-all";

const VendorData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const { data, meta, links } = await getAllVendor(page, per_page); // nanti page bisa dynamic

  const locale = await getLocale();

  const supabase = await createClient();

  const { count: countHospital } = await supabase
    .from("vendor")
    .select("category", { count: "exact" })
    .eq("category", "hospital");

  const { count: countCoach } = await supabase
    .from("vendor")
    .select("category", { count: "exact" })
    .eq("category", "coach");

  return (
    <>
      <ContainerWrap className="pb-[20vh]">
        <div className="my-10 flex items-center justify-between gap-5 sticky top-0 bg-linear-to-b from-background via-background z-20 py-5 w-full">
          <div className="flex flex-col w-full">
            <h4 className="text-primary font-semibold">Vendor Data</h4>
          </div>
          <Link href={`/${locale}/studio/vendor/add`}>
            <Button className="rounded-2xl flex lg:w-fit w-full">
              <Plus /> <p className="lg:block hidden">Add New Vendor</p>
            </Button>
          </Link>
        </div>
        <div className="summary bg-white p-4 rounded-2xl border mb-4 flex flex-wrap gap-4 items-center">
          <p className="text-sm! text-muted-foreground inline-flex gap-2 items-center bg-accent px-3 py-1 rounded-xl">
            <Database className="size-4" />
            <span>
              {locale === routing.defaultLocale
                ? "Ringkasan Data"
                : "Data Summary"}
            </span>
          </p>
          <p className="font-light text-sm! text-muted-foreground">
            <ChevronRight className="size-4 lg:flex hidden" />
            <ChevronDown className="size-4 lg:hidden flex" />
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <p className=" bg-teal-300 rounded-xl px-3 py-1 text-sm! w-fit">
              {meta.total} Vendor
            </p>
            <p className=" bg-lime-300 rounded-xl px-3 py-1 text-sm! w-fit">
              {countHospital} Hospital
            </p>
            <p className=" bg-amber-300 rounded-xl px-3 py-1 text-sm! w-fit">
              {countCoach} Coach
            </p>
          </div>
        </div>
        {/* <SearchOnAll /> */}
        <VendorHotelDataTable
          columns={columns}
          data={data}
          meta={meta}
          links={links}
          resourceType="vendor"
          deleteAction={deleteVendor}
        />
      </ContainerWrap>
    </>
  );
};

export default VendorData;
