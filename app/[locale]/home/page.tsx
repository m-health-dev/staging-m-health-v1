import CurrentEvents from "@/components/home/CurrentEvents";
import Jumbotron from "@/components/home/Jumbotron";
import OurNews from "@/components/home/OurNews";
import PopularMedical from "@/components/home/PopularMedical";
import PopularPackage from "@/components/home/PopularPackage";
import PopularProgram from "@/components/home/PopularProgram";
import QuickAction from "@/components/home/QuickAction";
import CallToAction from "@/components/utility/CallToAction";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const HomePage = () => {
  return (
    <Wrapper>
      <Jumbotron />
      <PopularPackage />
      <PopularProgram />
      <PopularMedical />
      <CurrentEvents />
      <OurNews />
      <CallToAction />
    </Wrapper>
  );
};

export default HomePage;
