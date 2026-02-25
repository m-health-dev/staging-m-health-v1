import React from "react";
import { notFound } from "next/navigation";

import { getArticleCategoryByID } from "@/lib/article-category/get-article-category";
import UpdateArticleCategoryForm from "./updateForm";

const UpdateArticleCategoryPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getArticleCategoryByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateArticleCategoryForm id={id} data={res.data} />;
};

export default UpdateArticleCategoryPage;
