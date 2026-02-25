import React from "react";
import { notFound } from "next/navigation";

import { getDoctorsByID } from "@/lib/doctor/get-doctor";
import UpdateDoctorForm from "./updateForm";

const UpdateDoctorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getDoctorsByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateDoctorForm id={id} data={res.data} />;
};

export default UpdateDoctorPage;
