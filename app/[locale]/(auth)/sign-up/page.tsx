import React from "react";
import { get5ImageWellness } from "@/lib/unsplashImage";
import SignUpClient from "./SignUp-Client";

const SignUpPage = async () => {
  const data = await get5ImageWellness();
  const image = data.results[3];
  return <SignUpClient image={image} />;
};

export default SignUpPage;
