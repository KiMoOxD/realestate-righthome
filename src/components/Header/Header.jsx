import React from "react";
import { NavLink, Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import { RiMenuLine, RiAdminLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineHome } from "react-icons/hi2";
import { MdOutlineManageSearch } from "react-icons/md";
import { useAllContext } from "../../context/AllContext";
import logo from '../../images/RIGHT_HOME.png';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Centralized navigation data
const navLinksData = [
    { to: "/", labelEn: "Home", labelAr: "الرئيسية", icon: HiOutlineHome },
    { to: "/browse", labelEn: "Browse", labelAr: "تصفح", icon: MdOutlineManageSearch },
    { to: "/admin", labelEn: "Admin", labelAr: "الادارة", icon: RiAdminLine },
];

export default function Header() {
  const { lang, toggleLang, isMenuOpen, toggleMenu } = useAllContext();

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { type: "tween", ease: "circOut", duration: 0.4 } },
    exit: { opacity: 0, x: "100%", transition: { type: "tween", ease: "circIn", duration: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <header className={`w-full bg-white border-b border-slate-200 ${lang === 'ar' && 'arabic'}`}>
        <div className="flex max-w-screen-2xl h-20 mx-auto justify-between items-center px-4">
          
          {/* --- Logo --- */}
          <Link to={'/'}>
            <LazyLoadImage src={logo} alt="Logo" className="w-20" />
          </Link>
          
          {/* --- Desktop Navigation & Actions --- */}
          <div className="hidden lg:flex items-center h-full">
            {/* The NavLinks component now receives the filtered data directly */}
            <NavLinks navLinksData={navLinksData.filter(l => l.to !== '/admin')} />
            <div className="w-px h-8 bg-slate-200 mx-2"></div>
            
            <button
                type="button"
                className="text-sm font-semibold w-12 h-12 flex items-center justify-center rounded-full transition-colors text-slate-700 hover:bg-slate-100"
                onClick={toggleLang}
            >
                {lang === "en" ? "AR" : "EN"}
            </button>
            <Link
                to={'/admin'}
                className="ml-2 text-sm font-semibold px-5 h-12 flex items-center rounded-full transition-colors border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
                {lang === "en" ? "Admin" : "الادارة"}
            </Link>
          </div>

          {/* --- Mobile Menu Trigger --- */}
          <div className="lg:hidden">
             <button onClick={toggleMenu} className="w-12 h-12 flex items-center justify-center text-2xl text-slate-700">
               <RiMenuLine />
             </button>
          </div>
        </div>
      </header>

      {/* --- ENHANCED Mobile Menu Panel --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // 1. Glassmorphism effect: semi-transparent with a backdrop blur for a modern, layered look.
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-900/10">
              <LazyLoadImage src={logo} alt="Logo" className="w-20" />
              <button onClick={toggleMenu} className="w-12 h-12 flex items-center justify-center text-3xl text-slate-500 rounded-full hover:bg-slate-500/10 transition-colors">
                <IoMdClose />
              </button>
            </div>
            <motion.ul
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="visible"
              className="flex-grow p-4 flex flex-col gap-2"
            >
              {navLinksData.map((link) => (
                // 2. Add interaction animations to the list item wrapper.
                <motion.li 
                  key={link.to} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={toggleMenu}
                    // 3. Updated styles for active and inactive links.
                    // The active state now uses the brand gradient for consistency.
                    className={({ isActive }) => `flex items-center gap-4 w-full p-4 rounded-xl text-lg font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                        : 'hover:bg-slate-500/10 text-slate-700'}`
                    }
                  >
                    <link.icon className="text-2xl"/>
                    <span>{lang === 'en' ? link.labelEn : link.labelAr}</span>
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>

            {/* 4. A new footer section added to the menu for key actions like language switching. */}
            <div className="p-4 mt-auto border-t border-slate-900/10">
                <button
                    type="button"
                    className="w-full text-center text-lg font-semibold p-3 rounded-xl transition-colors text-slate-700 hover:bg-slate-500/10"
                    onClick={() => {
                        toggleLang();
                        toggleMenu(); // Optionally close menu on lang change
                    }}
                >
                    {lang === "en" ? "تغيير للغة العربية" : "Switch to English"}
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}