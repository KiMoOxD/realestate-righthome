import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import { useAllContext } from "../context/AllContext";

export default function RootLayout() {
  let {lang} = useAllContext()
  return (
    <>
      <Header />
      <ScrollToTop />
      <div className={`relative mx-auto ${lang === 'ar' && 'arabic'}`}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
