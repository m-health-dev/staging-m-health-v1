import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { notFound } from "next/navigation";

const UpdateVendorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getVendorByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateVendorForm id={id} vendorData={res.data.data} />;
};

export default UpdateVendorPage;
