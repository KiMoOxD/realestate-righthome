import { useAllContext } from "../../context/AllContext";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PropertyInfo({ property }) {
  let { lang } = useAllContext();
  let formattedPriceEn = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  let formattedPriceAR = new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  });
  let [showNumber, setShowNumber] = useState(false);
  let pathName = useLocation();
  const phoneNumber = "+201145034531";
  const message = `
    Hello,\n
    I would like to get more information about this property:\n\n
    Type: ${property.category}\n
    Price: ${property.price} EGP\n
    Location: ${property.governate}\n
    Link: https://realestate-righthome-553z.vercel.app${pathName.pathname}\n\n
  `;

  return (
    <div className="w-full  order-2  flex flex-col">
      <div className={`flex gap-2 ${lang === "ar" && "justify-end arabic"}`}>
        <p className={`text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit`}>
          {property.status === "sale"
            ? lang === "en"
              ? "FOR SALE"
              : "للبيع"
            : lang === "en"
            ? "FOR RENT"
            : "للايجار"}
        </p>
        <p className={`text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit`}>
          {property.category.toUpperCase()}
        </p>
      </div>
      <h1
        className={`text-2xl md:text-3xl mt-1.5 ${
          lang === "ar" && "text-right arabic"
        }`}
      >
        {lang === "en" ? property.title.en : property.title.ar}
      </h1>
      <p className={`text-xs text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "Price" : "الـسعر"}
      </p>
      {lang === "en" && (
        <p className="relative font-semibold text-2xl">
          {formattedPriceEn.format(property.price).replace("$", "")} EGP
          <span className="absolute top-1/2 translate-y-[-50%] right-0 text-xs bg-stone-200/60 p-1 font-medium text-stone-800">
            Installment
          </span>
        </p>
      )}
      {lang === "ar" && (
        <p className="relative font-semibold text-2xl text-right ">
          {formattedPriceAR.format(property.price)}
          <span className="absolute top-1/2 translate-y-[-50%] left-0 text-xs bg-stone-200/60 p-1 font-medium text-stone-800">
            تقسيط
          </span>
        </p>
      )}
      <p className={`text-xs text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "Description" : "الوصف"}
      </p>
      <div
        className={`bg-stone-100 text-sm p-3 max-h-[174px] overflow-y-auto text-stone-700 mt-2 ${
          lang === "ar" && "text-right arabic"
        }`}
      >
        {lang === "en" ? property.description.en : property.description.ar}
      </div>
      <div className="flex justify-evenly items-center mt-4">
        <div className="flex flex-col items-center">
          <PiBathtubLight className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Bathrooms" : "دورة المياة"}
          </p>
          <p className="text-sm">{property.baths}</p>
        </div>
        <div className="flex flex-col items-center">
          <IoIosBed className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Bedrooms" : "غرف النوم"}
          </p>
          <p className="text-sm">{property.beds}</p>
        </div>
        <div className="flex flex-col items-center">
          <BiArea className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Area" : "مساحة"}
          </p>
          <p className="text-sm">
            {property.area} <span className="text-xs">m²</span>
          </p>
        </div>
        <div className="flex flex-col items-center">
          <LiaMoneyBillWaveAltSolid className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Installment" : "التقسيط"}
          </p>
          <p className="text-sm">Monthly or Quarterly</p>
        </div>
      </div>
      <hr className="my-2" />
      <div className="flex items-center gap-1 mt-2 *:w-1/2 *:text-sm md:*:text-base *:flex-grow text-white">
        <a
          href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
            message
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center gap-2 text-lg bg-green-500 py-2 group transition"
        >
          <FaWhatsapp className="text-2xl" /> WhatsApp
        </a>
        <button
          className="flex justify-center items-center gap-2 text-lg bg-blue-500 py-2"
          onClick={() => setShowNumber((prev) => !prev)}
        >
          <AnimatePresence mode="wait">
            {!showNumber ? (
              <motion.span
                key="phone-text"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                className="flex gap-2 items-center"
              >
                <IoIosCall className="text-2xl" /> Phone Number
              </motion.span>
            ) : (
              <motion.span
                key="phone-number"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                className="py-0.5"
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
