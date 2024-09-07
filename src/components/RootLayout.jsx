import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <>
      <div className="relative mx-auto">
        <Header />
        <ScrollToTop />
        <Outlet />
      </div>
      <div className="wspikes"></div>
      <Footer />
    </>
  );
}
