import React from "react";
import { notFound } from "next/navigation";

import { getArticleAuthorByID } from "@/lib/article-author/get-article-author";
import UpdateArticleAuthorForm from "./updateForm";

const UpdateArticleAuthorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getArticleAuthorByID(id);

  if (res.error) {
    notFound();
  }
  return <UpdateArticleAuthorForm id={id} data={res.data} />;
};

export default UpdateArticleAuthorPage;
