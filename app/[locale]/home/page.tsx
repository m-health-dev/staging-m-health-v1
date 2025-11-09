import Jumbotron from "@/components/home/Jumbotron";
import PopularPackage from "@/components/home/PopularPackage";
import QuickAction from "@/components/home/QuickAction";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const HomePage = () => {
  return (
    <Wrapper>
      <Jumbotron />
      <QuickAction />
      <PopularPackage />
    </Wrapper>
  );
};

export default HomePage;
