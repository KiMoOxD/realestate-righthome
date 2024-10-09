import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import { useAllContext } from "../context/AllContext";
import InitialLoader from "./InitialLoader";

export default function RootLayout() {
  let {lang} = useAllContext()
  return (
    <>
      <InitialLoader />
      <Header />
      <ScrollToTop />
      <div className={`relative mx-auto ${lang === 'ar' && 'arabic'}`}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
