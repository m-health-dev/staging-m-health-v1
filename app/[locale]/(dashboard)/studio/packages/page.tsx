import { Button } from "@/components/ui/button";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Studio1DataTable } from "@/components/package-wellness-medical/package-wellness-medical-data-table";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/client";
import { ChevronDown, ChevronRight, Database, Plus } from "lucide-react";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { columns } from "./columns";
import { getAllMedical } from "@/lib/medical/get-medical";
import { deleteMedical } from "@/lib/medical/delete-medical";
import { getAllPackages } from "@/lib/packages/get-packages";

const PackageStudio = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const per_page = Number(params.per_page ?? 10);

  const { data, meta, links } = await getAllPackages(page, per_page); // nanti page bisa dynamic

  const locale = await getLocale();

  const supabase = await createClient();

  return (
    <ContainerWrap className="pb-[20vh]">
      <div className="my-10 flex items-center justify-between gap-5 sticky top-0 bg-linear-to-b from-background via-background z-20 py-5 w-full">
        <div className="flex flex-col w-full">
          <h4 className="text-primary font-semibold">Packages Data</h4>
        </div>
        <Link href={`/${locale}/studio/packages/add`}>
          <Button className="rounded-2xl flex lg:w-fit w-full">
            <Plus /> <p className="lg:block hidden">Add New Packages</p>
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
            {meta.total} Package
          </p>
        </div>
      </div>
      <Studio1DataTable
        columns={columns}
        data={data}
        meta={meta}
        links={links}
        deleteAction={deleteMedical}
      />
    </ContainerWrap>
  );
};

export default PackageStudio;
