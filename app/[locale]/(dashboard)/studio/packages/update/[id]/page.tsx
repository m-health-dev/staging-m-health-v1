import React from "react";

import { notFound } from "next/navigation";

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
  return <UpdatePackageForm id={id} packageData={res.data} />;
};

export default UpdatePackagePage;
