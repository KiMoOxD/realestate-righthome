import { Link } from "react-router-dom";
import { useState } from "react";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { formattedPriceEn, formattedPriceAR } from "../utils/functions.js";
import { CgSpinner } from "react-icons/cg";
import { useAllContext } from "../context/AllContext.jsx";
export default function SearchItem({ result }) {
    let {lang} = useAllContext()
    let [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      to={`/browse/${result.category}s/${result.id}`}
      className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 cursor-pointer"
      onClick={() => setIsLoading(true)}
    >
      {isLoading ? (
        <div className="size-10 lg:size-14 relative">
          <CgSpinner className="animate-spin2 absolute top-1/2 left-1/2 text-xl text-blue-700" />
        </div>
      ) : (
        <img
          src={result.images[0]}
          alt=""
          className="size-10 lg:size-14 object-cover rounded"
        />
      )}
      <div className="text-left flex-grow text-xs lg:text-sm">
        <p className="truncate max-w-[140px] md:max-w-full">
          {lang === "en" ? result.title.en : result.title.ar}
        </p>
        <p>
          {lang === "en"
            ? formattedPriceEn.format(result.price).replace("$", "") + " EGP"
            : formattedPriceAR.format(result.price)}
        </p>
      </div>
      <div>
        <p className="text-right text-xs lg:text-sm">
          {lang === "en" ? result.region?.en : result.region?.ar}
        </p>
        <div className="flex items-center gap-2 justify-end *:text-xs *:flex *:items-center *:gap-1">
          <p>
            <IoIosBed /> {result.beds}
          </p>
          <p>
            <PiBathtubLight /> {result.baths}
          </p>
          <p>
            <BiArea /> {result.area}m
          </p>
        </div>
      </div>
    </Link>
  );
}
