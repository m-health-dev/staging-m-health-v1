import React from "react";

import { notFound } from "next/navigation";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import UpdateWellnessForm from "./updateForm";

const UpdateWellnessPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getWellnessByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateWellnessForm id={id} wellnessData={res.data.data} />;
};

export default UpdateWellnessPage;
