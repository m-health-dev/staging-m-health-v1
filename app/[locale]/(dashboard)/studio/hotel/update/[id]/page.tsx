import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { getHotelByID } from "@/lib/hotel/get-hotel";
import UpdateHotelForm from "./updateForm";

const UpdateHotelPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = (await getHotelByID(id)).data;

  if (!res || res.error) {
    toast.error("Failed to Get Hotel Data", {
      description: `${res.error}`,
    });
  }
  return <UpdateHotelForm id={id} hotelData={res.data} />;
};

export default UpdateHotelPage;
