import React from "react";
import ForgotPassClient from "./ForgotPass-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";
import { getLocale } from "next-intl/server";

const ForgotPassPage = async () => {
  const locale = await getLocale();
  return <ForgotPassClient locale={locale} />;
};

export default ForgotPassPage;
