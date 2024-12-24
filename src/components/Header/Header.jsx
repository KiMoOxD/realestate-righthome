import React from "react";
import NavLinks from "./NavLinks";
import { RiMenuLine } from "react-icons/ri";
import { useAllContext } from "../../context/AllContext";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineHome } from "react-icons/hi2";
import { MdManageSearch } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import logo from '../../images/RIGHT_HOME.png'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";



export default function Header() {
  let { lang, toggleLang, isMenuOpen, toggleMenu } = useAllContext();
  return (
    <div className={`bg-white sticky w-full top-0 z-40 shadow-md ${lang === 'ar' && 'arabic'}`}>
      <div className="flex px-4 rounded-lg max-w-screen-2xl h-14 mx-auto justify-between items-center">
        <Link to={'/'}><LazyLoadImage src={logo} alt="Logo" className="w-16 md:w-[70px]" /></Link>
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
                  className="absolute z-50 h-[100vh] shadow-lg border w-full sm:w-1/2 md:w-[400px] top-0 right-0 bg-stone-50 flex flex-col gap-1 *:transition bg-[url('https://st2.depositphotos.com/4362315/7512/v/950/depositphotos_75121491-stock-illustration-real-estate-background.jpg')] before:bg-white before:absolute before:h-full before:w-full before:opacity-80"
                >
                  <div className="relative flex justify-center bg-white">
                    <img src={logo} alt="Logo" className="w-16 md:w-[70px]"/>
                  </div>
                  <hr />
                  <Link
                    to={"/"}
                    className="relative px-5 py-3 bg-blue-500 text-white hover:bg-blue-800 rounded text-sm flex items-center justify-center gap-2"
                  >
                   <HiOutlineHome className="text-lg" /> <span className="mt-1">Home</span>
                  </Link>
                  <Link
                    to={"/browse"}
                    className="relative px-5 py-3 bg-blue-500 text-white hover:bg-blue-800 rounded text-sm flex items-center justify-center gap-1"
                  >
                    <MdManageSearch className="text-lg" /> <span className="mt-1">Browse</span>
                  </Link>
                  <Link
                    to={"/admin"}
                    className="relative px-5 py-3 bg-blue-500 text-white hover:bg-blue-800 rounded text-sm flex items-center justify-center gap-2.5"
                  >
                    <RiAdminLine className="text-lg" /> <span className="mt-1">Admin</span>
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
