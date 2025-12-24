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
import { getArticlesByID } from "@/lib/articles/get-articles";
import UpdateArticleForm from "./updateForm";

const UpdateArticlePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getArticlesByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateArticleForm id={id} data={res.data} />;
};

export default UpdateArticlePage;
