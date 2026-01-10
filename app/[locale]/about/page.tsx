import AboutClient from "@/components/about/AboutClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getImageAbout } from "@/lib/unsplashImage";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";

const About = async () => {
  const img = await getImageAbout();
  return (
    <Wrapper>
      <AboutClient />
    </Wrapper>
  );
};

export default About;
