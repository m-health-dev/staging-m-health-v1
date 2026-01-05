import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { getHotelByID } from "@/lib/hotel/get-hotel";
import UpdateHotelForm from "./updateForm";
import { notFound } from "next/navigation";

const UpdateHotelPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getHotelByID(id);

  if (res.error) {
    notFound();
  }

  return <UpdateHotelForm id={id} hotelData={res.data} />;
};

export default UpdateHotelPage;
