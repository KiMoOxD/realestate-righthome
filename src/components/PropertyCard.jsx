import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaDisease } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { useAllContext } from "../context/AllContext";
import { IoIosCall } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { TiCameraOutline } from "react-icons/ti";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import { formattedPriceEn, formattedPriceAR } from "../utils/functions";

const tourismRegions = [
  "Galala City",
  "Sokhna",
  "New Alamein",
  "North Coast",
  "Gouna",
];



export default function PropertyCard({ property }) {
  let { lang } = useAllContext();
  let isTourism = tourismRegions.some(reg => property.region.en === reg)
  let [showNumber, setShowNumber] = useState(false);
  let pathName = useLocation();
  let [isLoading, setIsLoading] = useState(false)
  const phoneNumber = "+201019363939";
  const message = `
    Hello,\n
    I would like to get more information about this property:\n\n
    Type: ${property.category}\n
    Price: ${property.price} EGP\n
    Location: ${property.region.en}\n
    Link: https://realestate-righthome-553z.vercel.app${pathName.pathname}\n
  `;
  useEffect(() => {
    setIsLoading(false)
  }, [property.id])
  return (
    <div className="rounded-md overflow-hidden bg-white shadow-md h-fit group cursor-pointer hover:shadow-lg transition">
      <Link to={`/browse/${property.category}s/${property.id}`} onClick={() => setIsLoading(true)}>
        <div className="relative h-[220px] overflow-hidden">
          {isLoading && <CgSpinner className="absolute top-1/2 left-1/2 animate-spin2 text-5xl text-blue-700"/>}
          <span className="absolute top-4 left-3 py-1 w-16 text-center bg-stone-50 rounded-full z-10 text-xs">
            {property.status === "sale"
              ? lang === "en"
                ? "For Sale"
                : "للبيع"
              : lang === "en"
              ? "For Rent"
              : "للايجار"}
          </span>
          <span className={`absolute flex items-center gap-1 top-4 left-20 py-1 min-w-16 px-2 text-center ${isTourism ? 'bg-blue-500' : 'bg-cyan-900'} rounded-full z-10 text-xs text-white`}>
            {!isTourism && <FaCity/>}{" "}
            {isTourism && <FaDisease />}{" "}
            {lang === "en" ? property.region?.en : property.region?.ar}
          </span>
          <span className={`absolute flex items-center gap-1.5 bottom-2 left-3 py-1 bg-black/30 px-1.5 text-center rounded-lg z-10 text-xs text-white`}>
              <TiCameraOutline className="text-xl text-stone-300"/> {property.images.length}
          </span>
          <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-[1] transition opacity-0 group-hover:opacity-75"></div>
          {!isLoading && <img
            className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
            src={property.images[0]}
            alt={property.title.en}
          />}
        </div>
        <div className="py-4 px-5">
          <p
            className={`text-xl ${
              lang === "ar" && "text-right"
            } text-stone-800 font-semibold truncate`}
          >
            {lang === "en" ? property.title.en : property.title.ar}
          </p>
          <div
            className={`flex flex-wrap ${
              lang === "ar" && "flex-row-reverse"
            } gap-1 md:gap-2 items-center text-sm mt-2 text-stone-500`}
          >
            <span
              className={`flex ${
                lang === "ar" && "flex-row-reverse"
              } items-center gap-1 bg-stone-100 px-2 py-1 rounded`}
            >
              <IoIosBed /> {lang === "en" ? `Beds:` : "سرير :"} {property.beds ? property.beds : '-'}
            </span>
            <span
              className={`flex ${
                lang === "ar" && "flex-row-reverse"
              } items-center gap-1 bg-stone-100 px-2 py-1 rounded`}
            >
              <PiBathtubLight /> {lang === "en" ? `Baths:` : "دورة مياة :"}{" "}
              {property.baths ? property.baths : '-'}
            </span>
            <span
              className={`flex ${
                lang === "ar" && "flex-row-reverse"
              } items-center gap-1 bg-stone-100 px-2 py-1 rounded`}
            >
              <BiArea /> {lang === "en" ? `Area:` : "مساحة :"} {property.area ? property.area : '-'}
              {property.area > 1 && <span>{(lang === "en") ? `m` : "م"}</span>}
            </span>
          </div>
        </div>
      </Link>
      <hr />
      <div className="relative flex items-center justify-between py-3 px-5">
        <AnimatePresence>
        {!showNumber ? <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 30}} className="flex items-center gap-2">
            <a href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
              message
            )}`}
            target="_blank"
            rel="noreferrer" className="bg-green-500 rounded-full p-1"><FaWhatsapp className="text-xl text-white peer/whatsapp" /></a>
            <a href={`tel:${phoneNumber}`} className="bg-blue-500 rounded-full p-1"><IoIosCall onClick={() => setShowNumber(true)} className="text-xl text-white peer/call" /></a>
        </motion.div> : <motion.p initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 30}} className="text-base flex items-center gap-1.5">{phoneNumber} <IoMdClose onClick={() => setShowNumber(false)} className="bg-blue-500 text-white size-4 text-xs rounded-full"/></motion.p>}
        </AnimatePresence>
        
        <p className="py-0.5">{lang === 'en' ? `EGP ${formattedPriceEn.format(property.price).replace("$", "")}` : formattedPriceAR.format(property.price)}</p>
      </div>
    </div>
  );
}
