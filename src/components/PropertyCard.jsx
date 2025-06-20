import React, { useEffect, useState } from "react";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { FaWhatsapp, FaSun } from "react-icons/fa";
import {
  FiPhoneCall,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useAllContext } from "../context/AllContext";
import { Link, useLocation } from "react-router-dom";
import { TiCameraOutline } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { formattedPriceEn, formattedPriceAR } from "../utils/functions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const tourismRegions = [
  "Galala City",
  "Sokhna",
  "New Alamein",
  "North Coast",
  "Gouna",
];

export default function PropertyCard({ property }) {
  const { lang } = useAllContext();
  const isTourism = tourismRegions.some((reg) => property.region.en === reg);
  const [showNumber, setShowNumber] = useState(false);
  const pathName = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    property.preview || 0
  );
  const [slideDirection, setSlideDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "+201019363939";
  const message = `
    Hello,
    I would like to get more information about this property:

    Type: ${property.category}
    Price: ${property.price} EGP
    Location: ${property.region.en}
    Link: https://realestate-righthome-553z.vercel.app${pathName.pathname}
  `;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [property.id]);

  useEffect(() => {
    setCurrentImageIndex(property.preview || 0);
  }, [property.id, property.preview]);

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideDirection(1);
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const premiumTransition = { type: "spring", stiffness: 400, damping: 30 };
  const gentleTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

  const imageVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1, transition: { ...gentleTransition } },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { ...gentleTransition },
    }),
  };

  // Condition to check if the price is a valid, non-zero number.
  const shouldShowPrice = !isNaN(property.price) && Number(property.price) !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={gentleTransition}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-400 border border-slate-100 h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col h-full bg-white rounded-2xl z-10 overflow-hidden">
        <Link
          to={`/browse/${property.category}s/${property.id}`}
          onClick={() => setIsLoading(true)}
          className="flex flex-col flex-grow"
        >
          <div className="relative h-56 overflow-hidden">
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={currentImageIndex}
                custom={slideDirection}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <LazyLoadImage
                  className="w-full h-full object-cover"
                  src={property.images[currentImageIndex]}
                  alt={property.title.en}
                  effect="blur"
                  width="100%"
                  height="100%"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
              <span className="py-1.5 px-4 bg-blue-600 text-white rounded-full text-xs font-semibold shadow-lg border border-white/20">
                {property.status === "sale"
                  ? lang === "en"
                    ? "For Sale"
                    : "للبيع"
                  : lang === "en"
                  ? "For Rent"
                  : "للايجار"}
              </span>
            </div>
            {property.images.length > 1 && (
              <AnimatePresence>
                {isHovered && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={premiumTransition}
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white z-20"
                    >
                      <FiChevronLeft className="text-slate-800 text-xl" />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={premiumTransition}
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white z-20"
                    >
                      <FiChevronRight className="text-slate-800 text-xl" />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            )}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 py-1.5 px-3 bg-black/60 backdrop-blur-md rounded-full z-20 text-xs text-white font-medium border border-white/20">
              <TiCameraOutline className="text-base" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentImageIndex}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentImageIndex + 1}
                </motion.span>
              </AnimatePresence>
              <span>/ {property.images.length}</span>
            </div>
          </div>
          <div className="flex flex-col flex-grow p-5">
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="flex flex-col flex-grow animate-fade-in">
                <div className="space-y-2">
                  <p
                    className={`text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent ${
                      lang === "ar" && "text-right"
                    }`}
                  >
                    {lang === "en"
                      ? shouldShowPrice
                        ? `EGP ${formattedPriceEn
                            .format(property.price)
                            .replace("$", "")}`
                        : "Contact"
                      : shouldShowPrice
                      ? formattedPriceAR.format(property.price)
                      : "تواصل"}
                  </p>
                  {property.paymentType === "installment" &&
                    property.monthlyPrice > 0 &&
                    property.insYears > 0 && (
                      <p
                        className={`text-xs text-slate-600 font-medium ${
                          lang === "ar" && "text-right"
                        }`}
                      >
                        {lang === "en"
                          ? `${formattedPriceEn
                              .format(property.monthlyPrice)
                              .replace("$", "")} Monthly / ${
                              property.insYears
                            } Years`
                          : `${formattedPriceAR
                              .format(property.monthlyPrice)
                              .replace("EGP", "")} شهريا / ${
                              property.insYears
                            } سنوات`}
                      </p>
                    )}
                </div>
                <h3
                  className={`mt-4 text-lg text-slate-800 font-bold h-14 text-wrap overflow-hidden line-clamp-2 leading-snug ${
                    lang === "ar" && "text-right"
                  }`}
                >
                  {lang === "en" ? property.title.en : property.title.ar}
                </h3>

                {/* --- LOCATION & DEVELOPER SECTION --- */}
                <div className="mt-4 space-y-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-300
                      ${
                        isTourism
                          ? "bg-amber-100/70 border border-amber-200/80"
                          : "bg-slate-100 border border-slate-200/80"
                      }
                      ${lang === "ar" && "flex-row-reverse"}`}
                  >
                    {isTourism ? (
                      <FaSun className="text-amber-500" />
                    ) : (
                      <FiMapPin className="text-blue-500" />
                    )}
                    <span
                      className={`font-semibold truncate ${
                        isTourism ? "text-amber-800" : "text-slate-700"
                      }`}
                    >
                      {lang === "en"
                        ? property.region?.en
                        : property.region?.ar}
                    </span>
                  </div>

                  {property.developer && property.developer !== "N/A" && (
                    <p
                      className={`text-xs text-slate-500 ${
                        lang === "ar" && "text-right"
                      }`}
                    >
                      {lang === "en" ? "By" : "بواسطة"}{" "}
                      <span className="font-semibold text-slate-700">
                        {property.developer}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex-grow"></div>
                <div className="flex items-center bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-200/80 rounded-xl mt-5">
                  {[
                    { icon: IoIosBed, value: property.beds },
                    { icon: PiBathtubLight, value: property.baths },
                    { icon: BiArea, value: property.area, unit: "m²" },
                  ].map((spec, index) => (
                    <React.Fragment key={index}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -3 }}
                        className={`flex flex-1 justify-center items-center gap-2.5 p-3 cursor-pointer ${
                          lang === "ar" && "flex-row-reverse"
                        }`}
                      >
                        <spec.icon className="text-slate-500 text-xl" />
                        <span className="font-bold text-slate-700 text-sm">
                          {spec.value || "-"} {spec.unit}
                        </span>
                      </motion.div>
                      {index < 2 && (
                        <div className="h-8 border-l border-slate-200/80"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Link>
        <div className="absolute top-4 right-4 z-20">
          <AnimatePresence mode="wait">
            {!showNumber ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={premiumTransition}
                className="flex gap-2"
              >
                <motion.a
                  href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
                    message
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 backdrop-blur-sm border border-white/20"
                >
                  <FaWhatsapp className="text-lg" />
                </motion.a>
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowNumber(true);
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 backdrop-blur-sm border border-white/20"
                >
                  <FiPhoneCall className="text-lg" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="number"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={premiumTransition}
                className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50"
              >
                <a
                  href={`tel:${phoneNumber}`}
                  className="text-base font-bold text-slate-800 tracking-wider"
                >
                  {phoneNumber}
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowNumber(false);
                  }}
                  className="p-1 rounded-full hover:bg-slate-200/70 transition-colors"
                >
                  <IoMdClose className="text-slate-600 text-lg" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
const SkeletonLoader = () => (
  <div className="space-y-4">
    <div className="h-8 bg-slate-200 rounded-lg w-3/4 animate-pulse"></div>
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded-lg w-full animate-pulse"></div>
      <div className="h-5 bg-slate-200 rounded-lg w-5/6 animate-pulse"></div>
    </div>
    <div className="h-5 bg-slate-200 rounded-lg w-1/2 animate-pulse pt-4"></div>
    <div className="flex-grow"></div>
    <div className="flex items-center bg-slate-100 rounded-xl mt-5 p-3">
      <div className="h-8 bg-slate-200 rounded-lg w-1/3 animate-pulse"></div>
      <div className="h-8 bg-slate-200 rounded-lg w-1/3 animate-pulse ml-2"></div>
      <div className="h-8 bg-slate-200 rounded-lg w-1/3 animate-pulse ml-2"></div>
    </div>
  </div>
);