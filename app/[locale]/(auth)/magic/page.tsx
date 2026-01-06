import React from "react";
import { get5ImageWellness } from "@/lib/unsplashImage";
import MagicLinkClient from "./Magic-Client";
import { createClient } from "@/utils/supabase/client";
import { getLocale } from "next-intl/server";

const OTPPage = async () => {
  const locale = await getLocale();

  return <MagicLinkClient locale={locale} />;
};

export default OTPPage;
