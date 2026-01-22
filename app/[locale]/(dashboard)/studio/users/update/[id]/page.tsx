import React from "react";

import { notFound } from "next/navigation";
import { getUserByID } from "@/lib/users/get-users";
import AccountClientForm from "@/app/[locale]/(dashboard)/account/account-client-form";
import { getLocale } from "next-intl/server";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";

const UpdateUserPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await getUserByID(id);

  const locale = await getLocale();

  if (res.error) {
    notFound();
  }

  return (
    <ContainerWrap>
      <h2 className="my-20 text-start text-primary font-bold">
        {locale === routing.defaultLocale ? "Perbarui Data Pengguna" : "Update Users Data"}
      </h2>
      <AccountClientForm admin locale={locale} account={res.data} />
    </ContainerWrap>
  );
};

export default UpdateUserPage;
