import React from "react";
import OTPClient from "./OTP-Client";
import { get5ImageWellness } from "@/lib/unsplashImage";

const OTPPage = async () => {
  const data = await get5ImageWellness();
  const image = data.results[1];
  return <OTPClient image={image} />;
};

export default OTPPage;
