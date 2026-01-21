import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import UpdateInsuranceForm from "./updateForm";
import { getInsuranceByID } from "@/lib/insurance/get-insurance";

const UpdateInsurancePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getInsuranceByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateInsuranceForm id={id} insuranceData={res.data} />;
};

export default UpdateInsurancePage;
