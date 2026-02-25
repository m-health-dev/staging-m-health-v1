import React from "react";

import { notFound } from "next/navigation";

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
