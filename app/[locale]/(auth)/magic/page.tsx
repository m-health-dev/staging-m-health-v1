import React from "react";
import { get5ImageWellness } from "@/lib/unsplashImage";
import MagicLinkClient from "./Magic-Client";
import { createClient } from "@/utils/supabase/client";

const OTPPage = async () => {
  const supabase = await createClient();

  return <MagicLinkClient />;
};

export default OTPPage;
