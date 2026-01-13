import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { getHotelByID } from "@/lib/hotel/get-hotel";
import UpdateHotelForm from "./updateForm";
import { notFound } from "next/navigation";
import { getConsultationByID } from "@/lib/consult/get-consultation";
import UpdateConsultationData from "./updateForm";
import { getLocale } from "next-intl/server";

const UpdateHotelPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getConsultationByID(id);
  const locale = await getLocale();

  if (res.error) {
    notFound();
  }

  return (
    <UpdateConsultationData
      id={id}
      data={res.data.data}
      locale={locale}
      accounts={res.data.data.user}
    />
  );
};

export default UpdateHotelPage;
