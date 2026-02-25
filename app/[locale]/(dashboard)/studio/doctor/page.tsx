import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Studio1DataTable } from "@/components/package-wellness-medical/studio-1-data-table";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/client";
import { ChevronDown, ChevronRight, Database, Plus } from "lucide-react";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { columns } from "./columns";

import { getAllDoctors } from "@/lib/doctor/get-doctor";
import { deleteDoctor } from "@/lib/doctor/delete-doctor";

const DoctorStudio = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const { data, meta, links } = await getAllDoctors(page, per_page); // nanti page bisa dynamic

  const locale = await getLocale();

  const supabase = await createClient();

  return (
    <ContainerWrap className="pb-[20vh]">
      <div className="my-10 flex items-center justify-between gap-5 sticky top-0 bg-linear-to-b from-background via-background z-20 py-5 w-full">
        <div className="flex flex-col w-full">
          <h4 className="text-primary font-semibold">
            {locale === routing.defaultLocale ? "Data Dokter" : "Doctors Data"}
          </h4>
        </div>
        <Link href={`/${locale}/studio/doctor/add`}>
          <Button className="rounded-2xl flex lg:w-fit w-full">
            <Plus />{" "}
            <p className="lg:block hidden">
              {locale === routing.defaultLocale
                ? "Tambah Dokter Baru"
                : "Add New Doctor"}
            </p>
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
            {meta.total}{" "}
            {locale === routing.defaultLocale ? "Dokter" : "Doctor"}
          </p>
        </div>
      </div>
      <Studio1DataTable
        type="doctor"
        columns={columns}
        data={data}
        meta={meta}
        locale={locale}
        links={links}
        deleteAction={deleteDoctor}
      />
    </ContainerWrap>
  );
};

export default DoctorStudio;
