import { Link } from "react-router-dom";
import { useState } from "react";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoBedOutline } from "react-icons/io5";
import { formattedPriceEn, formattedPriceAR } from "../utils/functions.js";
import { CgSpinner } from "react-icons/cg";
import { useAllContext } from "../context/AllContext.jsx";

export default function SearchItem({ result }) {
  const { lang } = useAllContext();
  const [isLoading, setIsLoading] = useState(false);

  // Skeleton loader with responsive size
  const ImageSkeleton = () => (
    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-slate-700/50 rounded-md flex items-center justify-center">
      <CgSpinner className="animate-spin text-2xl text-blue-400" />
    </div>
  );

  return (
    <Link
      to={`/browse/${result.category}s/${result.id}`}
      className="group relative flex items-center gap-3 sm:gap-4 w-full text-white rounded-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden bg-slate-800/60 hover:bg-slate-700/80 shadow-md hover:shadow-lg border border-white/10 p-2"
      onClick={() => setIsLoading(true)}
    >
      {/* --- Subtle Shine Effect --- */}
      <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />

      {/* --- Image Section: Responsive Fixed Size --- */}
      {/* The container is now smaller on mobile (w-20, h-20) and larger on sm screens and up (w-24, h-24) */}
      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden">
        {isLoading ? (
          <ImageSkeleton />
        ) : (
          <img
            src={result.images[result.preview ? result.preview : 0]}
            alt={lang === "en" ? result.title.en : result.title.ar}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="flex flex-col flex-grow justify-center min-w-0">
        
        {/* Top Part: Title and Region */}
        <div>
          <p className="font-semibold text-base text-slate-100 truncate" title={lang === "en" ? result.title.en : result.title.ar}>
            {lang === "en" ? result.title.en : result.title.ar}
          </p>
          <p className="text-sm text-slate-400 truncate">
            {lang === "en" ? result.region?.en : result.region?.ar}
          </p>
        </div>

        <div className="w-full h-[1px] bg-white/10 my-2"></div>

        {/* --- Responsive Bottom Section (FIX FOR OVERLAP) --- */}
        {/* On mobile (default), this is a flex-col, stacking the price and stats. */}
        {/* On small screens and up (sm:), it becomes a flex-row to place them side-by-side. */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          
          {/* Property Stats */}
          <div className="flex items-center gap-x-3 text-slate-300">
            <p className="flex items-center gap-1.5 text-sm" title={`${result.beds} Beds`}>
              <IoBedOutline className="text-lg text-blue-300/80" />
              <span>{result.beds}</span>
            </p>
            <p className="flex items-center gap-1.5 text-sm" title={`${result.baths} Bathrooms`}>
              <PiBathtubLight className="text-lg text-blue-300/80" />
              <span>{result.baths}</span>
            </p>
            <p className="flex items-center gap-1.5 text-sm" title={`${result.area} m²`}>
              <BiArea className="text-lg text-blue-300/80" />
              <span>{result.area}m²</span>
            </p>
          </div>

          {/* Price (aligned to the left on mobile, right on desktop) */}
          <div className="text-left sm:text-right">
            <p className="font-bold text-lg text-blue-400">
              {lang === "en"
                ? !isNaN(result.price) ? `${formattedPriceEn.format(result.price).replace("$", "")}` : "Contact"
                : !isNaN(result.price) ? formattedPriceAR.format(result.price).replace("EGP", "") : 'تواصل'}
            </p>
          </div>

        </div>
      </div>
    </Link>
  );
}