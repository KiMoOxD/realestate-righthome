import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoInstagram } from "react-icons/io";
import { useAllContext } from "../../context/AllContext";

export default function CallInfo({ property }) {
  let [showNumber, setShowNumber] = useState(false);
  let { lang } = useAllContext();
  let pathName = useLocation();
  let phoneNumber = "+201019363939";
  let message = `
  Hello,\n
  I would like to get more information about this property:\n
  Type: ${property.category}\n
  Location: ${property.region.en}\n
  Link: https://realestate-righthome-553z.vercel.app${pathName.pathname}\n`;

  return (
    <div className="flex flex-col w-full">
      <div className=" shadow-md rounded-md p-5 mb-3">
        <p
          className={`text-xs mt-2 text-stone-400 ${
            lang === "ar" && "text-right"
          }`}
        >
          {lang === "en" ? "About" : "تفاصيل"}
        </p>
        <pre
          className={`text-sm leading-snug font-sans font-medium text-wrap text-stone-700 mt-2 min-h-[44px] ${
            lang === "ar" && "text-right arabic"
          }`}
        >
          {lang === "en"
            ? property.about?.en
              ? property.about.en
              : "-"
            : property.about?.ar
            ? property.about.ar
            : "-"}
        </pre>
      </div>
      <div className="w-full flex flex-col items-center gap-3 text-white bg-blue-500 shadow-md rounded-md p-5 xl:p-10">
        <p className="text-3xl text-white">CONTACT US</p>
        <div className="mt-5 bg-red w-full flex justify-evenly gap-1 text-white text-xl mb-5">
          <a
            href="https://www.facebook.com/profile.php?id=100064228025102"
            className="flex flex-col gap-1 items-center"
          >
            <IoLogoFacebook className="text-4xl" /> Facebook
          </a>
          <a
            href="https://www.instagram.com/right.homee"
            className="flex flex-col gap-0.5 items-center"
          >
            <IoLogoInstagram className="text-4xl" /> Instagram
          </a>
        </div>
        <a
          href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
            message
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center gap-2 text-lg py-3 group transition bg-green-300 w-full rounded-md"
        >
          <FaWhatsapp className="text-3xl bg-green-500 rounded-full p-1" />
          <p className="text-stone-800 text-base">WhatsApp</p>
        </a>
        <button
          className="flex justify-center items-center gap-2 text-lg bg-blue-200 w-full rounded-md py-2"
          onClick={() => setShowNumber((prev) => !prev)}
        >
          <AnimatePresence mode="wait">
            {!showNumber ? (
              <motion.a
                key="phone-text"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                className="flex justify-center items-center gap-2 text-lg py-1.5"
                href={`tel:${phoneNumber}`}
              >
                <IoIosCall className="text-3xl bg-blue-500 rounded-full p-1" />
                <p className="text-stone-800 text-base">Phone Number</p>
              </motion.a>
            ) : (
              <motion.span
                key="phone-number"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                className="text-black py-1"
              >
                +201145034531
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
