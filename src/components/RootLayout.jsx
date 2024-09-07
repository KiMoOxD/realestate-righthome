import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <div className="relative mx-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
