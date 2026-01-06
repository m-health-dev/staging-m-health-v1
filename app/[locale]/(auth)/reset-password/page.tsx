import React from "react";
import ForgotPassClient from "./ResetPass-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";
import ResetPassClient from "./ResetPass-Client";
import { getLocale } from "next-intl/server";

const ResetPassPage = async () => {
  const locale = await getLocale();
  return <ResetPassClient locale={locale} />;
};

export default ResetPassPage;
