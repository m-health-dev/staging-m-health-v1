import React from "react";
import ForgotPassClient from "./ForgotPass-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";

const ForgotPassPage = async () => {
  const data = await get5ImageWellness();
  const image = data.results[1];
  return <ForgotPassClient image={image} />;
};

export default ForgotPassPage;
