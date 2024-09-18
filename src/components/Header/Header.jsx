import React from "react";
import NavLinks from "./NavLinks";
import { RiMenuLine } from "react-icons/ri";
import { useAllContext } from "../../context/AllContext";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  let { lang, toggleLang, isMenuOpen, toggleMenu } = useAllContext();
  return (
    <div className={`bg-white sticky w-full top-0 z-40 shadow-md ${lang === 'ar' && 'arabic'}`}>
      <div className="flex px-4 rounded-lg max-w-screen-2xl h-14 mx-auto justify-between items-center">
        <h1 className="font-semibold">Right Home</h1>
        <NavLinks />
        <div className="flex items-center h-full gap-2">
          <button
            type="button"
            className="text-xs w-20 py-2 rounded-full text-white bg-blue-500"
            onClick={toggleLang}
          >
            {lang === "en" ? "AR" : "EN"}
          </button>
          <Link
            to={'/admin'}
            className="text-xs w-20 text-center py-2 rounded-full text-black border border-black hidden lg:block"
          >
            {lang === "en" ? "Admin" : "الادارة"}
          </Link>
          <div className="p-2 text-2xl lg:hidden overflow-hidden max-w-full">
            <RiMenuLine
              onClick={toggleMenu}
              className="cursor-pointer text-stone-700"
            />
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{type: 'tween'}}
                  className="absolute z-50 h-[100vh] w-full sm:w-3/4 md:w-[400px] top-0 right-0 bg-stone-50 flex flex-col gap-1 *:transition"
                >
                  <p className="text-2xl text-center font-semibold py-3">
                    Right Home
                  </p>
                  <hr />
                  <Link
                    to={"/"}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded text-md text-center"
                  >
                    Home
                  </Link>
                  <Link
                    to={"/browse"}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded text-md text-center"
                  >
                    Browse
                  </Link>
                  <Link
                    to={"/admin"}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded text-md text-center"
                  >
                    Admin
                  </Link>
                  <IoMdClose
                    onClick={toggleMenu}
                    className="absolute top-4 left-4 text-3xl text-stone-500 cursor-pointer"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
