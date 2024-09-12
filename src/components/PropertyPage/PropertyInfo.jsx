import { useAllContext } from "../../context/AllContext";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";



export default function PropertyInfo({ property }) {
  let { lang } = useAllContext();
  let formattedPriceEn = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  let formattedPriceAR = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  })
  return (
    <div className="w-full lg:w-auto lg:max-w-[600px] lg:min-w-[450px] order-2  flex flex-col">
      <div className={`flex gap-2 ${lang === "ar" && 'justify-end arabic'}`}>
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
      <h1 className={`text-2xl md:text-3xl mt-1.5 ${lang === "ar" && 'text-right arabic'}`}>
        {lang === "en" ? property.title.en : property.title.ar}
      </h1>
      <p className={`text-xs text-stone-400 ${lang === 'ar' && 'text-right'}`}>{lang === 'en' ? 'Price' : 'الـسعر'}</p>
      {lang === 'en' &&<p className="font-semibold text-2xl">{formattedPriceEn.format(property.price).replace('$', '')} EGP</p>}
      {lang === 'ar' && <p className="font-semibold text-2xl text-right ">{formattedPriceAR.format(property.price)}</p>}
      <div className={`bg-stone-100 p-3 text-stone-700 mt-2 ${lang === "ar" && 'text-right arabic'}`}>
        {lang === 'en' ? property.description.en : property.description.ar}
      </div>
      <div className="flex justify-evenly items-center mt-4">
          <div className="flex flex-col items-center">
            <PiBathtubLight className="text-xl text-stone-500"/>
            <p className="text-xs text-stone-500 arabic">{lang === 'en' ? 'Bathrooms' : 'دورة المياة'}</p>
            <p className="text-sm">{property.baths}</p>
          </div>
          <div className="flex flex-col items-center">
            <IoIosBed className="text-xl text-stone-500"/>
            <p className="text-xs text-stone-500 arabic">{lang === 'en' ? 'Bedrooms' : 'غرف النوم'}</p>
            <p className="text-sm">{property.beds}</p>
          </div>
          <div className="flex flex-col items-center">
            <BiArea className="text-xl text-stone-500"/>
            <p className="text-xs text-stone-500 arabic">{lang === 'en' ? 'Area' : 'مساحة'}</p>
            <p className="text-sm">{property.area}</p>
          </div>   
      </div>
      <hr className="my-2"/>
      <div className="flex items-center gap-1 mt-2 *:w-1/2 *:text-sm md:*:text-base *:flex-grow text-white">
          <button className="flex justify-center items-center gap-2 text-lg bg-green-500 py-2">
            <FaWhatsapp className="text-2xl"/> WhatsApp
          </button>
          <button className="flex justify-center items-center gap-2 text-lg bg-blue-500 py-2">
            <IoIosCall className="text-2xl"/> Phone Number
          </button>
      </div>
    </div>
  );
}
