import React from "react";

import { getLocale } from "next-intl/server";

import ContainerWrap from "@/components/utility/ContainerWrap";

import RecoveryPageClient from "./recovery-page-client";

const RecoveryAccountPage = async () => {
  const locale = await getLocale();
  return (
    <ContainerWrap className="pb-[20vh]">
      <RecoveryPageClient locale={locale} />
    </ContainerWrap>
  );
};

export default RecoveryAccountPage;
