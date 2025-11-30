import React from "react";
import ForgotPassClient from "./ResetPass-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";
import ResetPassClient from "./ResetPass-Client";

const ResetPassPage = async () => {
  const data = await get5ImageWellness();
  const image = data.results[1];
  return <ResetPassClient image={image} />;
};

export default ResetPassPage;
