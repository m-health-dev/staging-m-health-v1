import React from "react";
import SignInClient from "./SignIn-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";
import { createClient } from "@/utils/supabase/client";

const SignInPage = async () => {
  return <SignInClient />;
};

export default SignInPage;
