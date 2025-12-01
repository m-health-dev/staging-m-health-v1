import React from "react";
import { get5ImageWellness } from "@/lib/unsplashImage";
import MagicLinkClient from "./Magic-Client";
import { createClient } from "@/utils/supabase/client";

const OTPPage = async () => {
  const supabase = await createClient();
  const { data } = supabase.storage
    .from("m-health-public")
    .getPublicUrl("dummy/apple_diet_program.jpg");
  const image = data.publicUrl;
  return <MagicLinkClient image={image} />;
};

export default OTPPage;
