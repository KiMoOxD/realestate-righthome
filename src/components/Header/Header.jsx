import React from "react";
import NavLinks from "./NavLinks";
import { RiMenuLine } from "react-icons/ri";
import { useAllContext } from "../../context/AllContext";

export default function Header() {
  let {lang, toggleLang} = useAllContext()
  return (
    <div className="bg-white sticky top-0 z-40">
      <div className="flex px-4 rounded-lg max-w-screen-2xl h-14 mx-auto justify-between items-center">
        <h1 className="font-semibold">Right Home</h1>
        <NavLinks />
        <div className="flex items-center h-full gap-2">
          <button
            type="button"
            className="text-xs w-20 py-2 rounded-full text-white bg-blue-500"
            onClick={toggleLang}
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
          <button
            type="button"
            className="text-xs w-20 py-2 rounded-full text-black border border-black hidden lg:block"
          >
            {lang === 'en' ? 'Admin' : 'الادارة'}
          </button>
          <div className="p-2 text-2xl lg:hidden">
            <RiMenuLine />
          </div>
        </div>
      </div>
    </div>
  );
}
