import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import ScrollToTop from "./ScrollToTop";

export default function RootLayout() {
  return (
    <>
      <div className="relative mx-auto">
        <Header />
        <ScrollToTop />
        <Outlet />
      </div>
    </>
  );
}
