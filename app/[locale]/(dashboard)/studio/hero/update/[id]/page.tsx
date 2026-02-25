import React from "react";

import { notFound } from "next/navigation";

import { getLocale } from "next-intl/server";

import { getHeroByID } from "@/lib/hero/get-hero";
import UpdateHeroClient from "./updateForm";

const UpdateHeroPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getHeroByID(id);

  const locale = await getLocale();

  if (res.error) {
    notFound();
  }

  return <UpdateHeroClient locale={locale} hero={res.data} />;
};

export default UpdateHeroPage;
