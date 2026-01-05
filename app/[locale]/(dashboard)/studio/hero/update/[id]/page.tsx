import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { getHotelByID } from "@/lib/hotel/get-hotel";
import UpdateHotelForm from "./updateForm";
import { notFound } from "next/navigation";
import { getUserByID } from "@/lib/users/get-users";
import AccountClientForm from "@/app/[locale]/(dashboard)/account/account-client-form";
import { getLocale } from "next-intl/server";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { getHeroByID } from "@/lib/hero/get-hero";
import UpdateHeroClient from "./updateForm";

const UpdateHeroPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getHeroByID(id);

  const locale = await getLocale();

  if (res.error) {
    notFound();
  }

  return <UpdateHeroClient locale={locale} hero={res.data} />;
};

export default UpdateHeroPage;
