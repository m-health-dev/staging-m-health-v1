import React from "react";

import { notFound } from "next/navigation";
import { getMedicalEquipmentByID } from "@/lib/medical-equipment/get-medical-equipment";
import UpdateEquipmentForm from "./updateForm";

const UpdateEquipmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getMedicalEquipmentByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateEquipmentForm id={id} data={res.data.data} />;
};

export default UpdateEquipmentPage;
