import Jumbotron from "@/components/home/Jumbotron";
import PopularPackage from "@/components/home/PopularPackage";
import QuickAccess from "@/components/home/QuickAccess";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const HomePage = () => {
  return (
    <Wrapper>
      <Jumbotron />
      <QuickAccess />
      <PopularPackage />
    </Wrapper>
  );
};

export default HomePage;
