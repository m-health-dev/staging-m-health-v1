import CurrentEvents from "@/components/home/CurrentEvents";
import Jumbotron from "@/components/home/Jumbotron";
import OurNews from "@/components/home/OurNews";
import PopularMedical from "@/components/home/PopularMedical";
import PopularPackage from "@/components/home/PopularPackage";
import PopularProgram from "@/components/home/PopularProgram";
import CallToAction from "@/components/utility/CallToAction";
import Wrapper from "@/components/utility/Wrapper";
import { NextIntlClientProvider } from "next-intl";

const HomePage = async () => {
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
