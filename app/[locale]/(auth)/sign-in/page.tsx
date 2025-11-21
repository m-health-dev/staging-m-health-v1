import React from "react";
import SignInClient from "./SignIn-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";

const SignInPage = async () => {
  const data = await get5ImageWellness();
  const image = data.results[0];
  return <SignInClient image={image} />;
};

export default SignInPage;
