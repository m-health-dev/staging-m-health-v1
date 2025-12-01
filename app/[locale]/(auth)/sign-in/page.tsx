import React from "react";
import SignInClient from "./SignIn-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";
import { createClient } from "@/utils/supabase/client";

const SignInPage = async () => {
  const supabase = await createClient();
  const { data } = supabase.storage
    .from("m-health-public")
    .getPublicUrl("dummy/lembah_sriti_calm_night.jpg");
  const image = data.publicUrl;
  return <SignInClient image={image} />;
};

export default SignInPage;
