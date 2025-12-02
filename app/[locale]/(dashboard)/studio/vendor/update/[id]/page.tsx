import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";

const UpdateVendorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = (await getVendorByID(id)).data;

  if (!res || res.error) {
    toast.error("Failed to Get Vendor Data", {
      description: `${res.error}`,
    });
  }
  return <UpdateVendorForm id={id} vendorData={res.data} />;
};

export default UpdateVendorPage;
