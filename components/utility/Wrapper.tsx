import React from "react";
import NavHeader from "./header/NavHeader";
import Footer from "./footer/Footer";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavHeader />
      {children}
      <Footer />
    </>
  );
};

export default Wrapper;
