import React from "react";
import { get5ImageWellness } from "@/lib/unsplashImage";
import MagicLinkClient from "./Magic-Client";

const OTPPage = async () => {
  const data = await get5ImageWellness();
  const image = data.results[1];
  return <MagicLinkClient image={image} />;
};

export default OTPPage;
