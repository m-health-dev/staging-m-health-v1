import React from "react";
import UpdateVendorForm from "./updateForm";
import { getVendorByID } from "@/lib/vendors/get-vendor";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import UpdateWellnessForm from "./updateForm";
import { getMedicalByID } from "@/lib/medical/get-medical";
import UpdateMedicalForm from "./updateForm";
import { getPackageByID } from "@/lib/packages/get-packages";
import UpdatePackageForm from "./updateForm";

const UpdatePackagePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getPackageByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdatePackageForm id={id} packageData={res.data.data} />;
};

export default UpdatePackagePage;
