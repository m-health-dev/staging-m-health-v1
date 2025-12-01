import React from "react";
import { get5ImageWellness } from "@/lib/unsplashImage";
import SignUpClient from "./SignUp-Client";
import { createClient } from "@/utils/supabase/client";

const SignUpPage = async () => {
  const supabase = await createClient();
  const { data } = supabase.storage
    .from("m-health-public")
    .getPublicUrl("dummy/batu_light_trek.jpg");
  const image = data.publicUrl;
  return <SignUpClient image={image} />;
};

export default SignUpPage;
