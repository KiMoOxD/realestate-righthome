import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaDisease } from "react-icons/fa";
// import { FaCity } from "react-icons/fa";
import { useAllContext } from "../context/AllContext";
import { IoIosCall } from "react-icons/io";
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
    let {lang} = useAllContext()
  return (
    <Link to={`browse/${property.category}s/${property.id}`} className="rounded-md overflow-hidden bg-stone-50/50 border group cursor-pointer">
      <div className="relative h-[280px] overflow-hidden">
        <span className="absolute top-4 left-3 py-1 w-16 text-center bg-stone-50 rounded-full z-20 text-xs">
          {property.status === 'sale' ? lang === 'en' ? 'For Sale' : 'للبيع' : lang === 'en' ? 'For Rent' : 'للايجار' }
        </span>
        <span className="absolute flex items-center gap-1 top-4 left-20 py-1 min-w-16 px-2 text-center bg-blue-500 rounded-full z-20 text-xs text-white">
          <FaDisease /> {lang === 'en' ? property.governate.en : property.governate.ar}
        </span>
        <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
        <img
          className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
          src={property.images[0]}
          alt=""
        />
      </div>
      <div className="py-4 px-5">
        <p className={`text-xl ${lang === 'ar' && 'text-right'} text-stone-800 font-semibold truncate`}>
          {lang === 'en' ? property.title.en : property.title.ar}
        </p>
        <div className={`flex flex-wrap ${lang === 'ar' && 'flex-row-reverse'} gap-1 md:gap-2 items-center text-sm mt-2 text-stone-500`}>
          <span className={`flex ${lang === 'ar' && 'flex-row-reverse'} items-center gap-1 bg-stone-100 px-2 py-1 rounded`}>
            <IoIosBed /> {lang === 'en' ? `Beds:` : 'سرير :'} {property.beds}
          </span>
          <span className={`flex ${lang === 'ar' && 'flex-row-reverse'} items-center gap-1 bg-stone-100 px-2 py-1 rounded`}>
            <PiBathtubLight /> {lang === 'en' ? `Baths:` : 'دورة مياة :'} {property.beds}
          </span>
          <span className={`flex ${lang === 'ar' && 'flex-row-reverse'} items-center gap-1 bg-stone-100 px-2 py-1 rounded`}>
            <BiArea /> {lang === 'en' ? `Area:` : 'مساحة :'} {property.area}{lang === 'en' ? `m` : 'م'}
          </span>
        </div>
      </div>
      <hr />
      <div className="relative flex items-center justify-between py-3 px-5">
        <div className="flex items-center gap-2">
          <FaWhatsapp className="text-2xl text-green-600 peer/whatsapp" />
          <IoIosCall className="text-2xl text-stone-800 peer/whatsapp" />
        </div>
        <p>${property.price}</p>
      </div>
    </Link>
  );
}
