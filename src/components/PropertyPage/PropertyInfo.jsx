import { useAllContext } from "../../context/AllContext";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { GiProgression } from "react-icons/gi";
import { formattedPriceEn, formattedPriceAR } from "../../utils/functions";
import { PiBuildingsLight } from "react-icons/pi";
import { HiOutlineCollection } from "react-icons/hi";
import { HiOutlineBadgeCheck } from "react-icons/hi";

export default function PropertyInfo({ property }) {
  let { lang } = useAllContext();

  return (
    <div className="max-w-full w-full md:w-full lg:w-[700px] xl:w-[900px] mt-5 order-2 flex flex-col">
      <div className={`flex gap-2 ${lang === "ar" && "justify-end arabic"}`}>
        <p className={`text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit`}>
          {property.category?.toUpperCase()}{" "}
          {property.category === "apartment" &&
            "(" + property.apartmentType?.toUpperCase() + ")"}
          {property.category === "retail" &&
            "(" + property.retailType?.toUpperCase() + ")"}
        </p>
        {property.category === "villa" && (
          <p className={`text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit`}>
            {property.villaType}
          </p>
        )}
        <p className={`text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit`}>
          {property.status === "sale"
            ? lang === "en"
              ? "FOR SALE"
              : "للبيع"
            : lang === "en"
            ? "FOR RENT"
            : "للايجار"}
        </p>
      </div>
      <h1
        className={`text-2xl md:text-3xl mt-1.5 ${
          lang === "ar" && "text-right arabic"
        }`}
      >
        {lang === "en" ? property.title.en : property.title.ar}
      </h1>
      {property.paymentType === 'installment' && property.developer && <p className={`text-sm mb-1 px-2 py-1 w-fit ${lang === 'en' ? 'mr-auto' : 'ml-auto'} bg-stone-100 rounded-md`}>
            Developer: {property.developer}
          </p>}
      <p className={`text-xs text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "Price" : "الـسعر"}
      </p>
      <p
        className={`relative font-semibold text-2xl ${
          lang === "ar" ? "text-right" : ""
        }`}
      >
        {lang === "en"
          ? !isNaN(property.price)
            ? `${formattedPriceEn.format(property.price).replace("$", "")} EGP`
            : "Contact for price"
          : !isNaN(property.price)
          ? formattedPriceAR.format(property.price)
          : "تواصل لمعرفة السعر"}

        <span
          className={`absolute top-1/2 translate-y-[-50%] ${
            lang === "ar" ? "left-0" : "right-0"
          } text-xs bg-stone-200/60 py-1 px-3 rounded text-stone-800`}
        >
          {property.paymentType === "cash"
            ? lang === "en"
              ? "Cash"
              : "كاش"
            : lang === "en"
            ? "Installment"
            : "تقسيط"}
        </span>

        {property.rentType !== "N/A" && property.status === "rent" && (
          <span
            className={`absolute top-1/2 translate-y-[-50%] ${
              lang === "ar" ? "left-14" : "right-14"
            } text-xs bg-stone-200/60 py-1 px-3 rounded text-stone-800`}
          >
            {property.rentType === "daily"
              ? lang === "en"
                ? "Daily"
                : "يومي"
              : lang === "en"
              ? "Monthly"
              : "شهري"}
          </span>
        )}
      </p>
      {property.paymentType === 'installment' && property.monthlyPrice && property.insYears ? <p className={`text-xs ${lang === 'en' ? 'mr-auto' : 'ml-auto'}`}>
           {property.monthlyPrice} Monthly / {property.insYears} Years
          </p> : null}
      {property.paymentType === "installment" && (
        <p
          className={`text-xs text-stone-400 mt-2 ${
            lang === "ar" && "text-right"
          }`}
        >
          {lang === "en" ? "Installment" : "التقسيط"}
        </p>
      )}
      {property.paymentType === "installment" && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center">
            <LiaMoneyBillWaveAltSolid className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Down Payment" : "مقدم"}
            </p>
            <p className="text-sm">
              {lang === "en"
                ? property.downPayment
                  ? `${formattedPriceEn
                      .format(property.downPayment)
                      .replace("$", "")} EGP`
                  : "-"
                : property.downPayment
                ? formattedPriceAR.format(property.downPayment)
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <GiProgression className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Duration (Year)" : "(سنة) مدة التقسيط"}
            </p>
            <p className="text-sm">
              {property.insYears ? property.insYears : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <HiOutlineCollection className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Installment Type" : "نوع التقسيط"}
            </p>
            <p className="text-sm">
              {property.insType ? property.insType : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <HiOutlineBadgeCheck className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Handover Date (Years)" : "(سنة) مدة الاستلام"}
            </p>
            <p className="text-sm">
              {property.recieveDate ? property.recieveDate : "-"}
            </p>
          </div>
        </div>
      )}
      {property.paymentType === "installment" && <hr className="my-2" />}
      <div
        className={`grid ${
          property.category === "studio" || property.category === "apartment"
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-3"
        } mt-4`}
      >
        <div className="flex flex-col items-center">
          <PiBathtubLight className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Bathrooms" : "دورة المياة"}
          </p>
          <p className="text-sm">{+property.baths ? property.baths : "-"}</p>
        </div>
        <div className="flex flex-col items-center">
          <IoIosBed className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Bedrooms" : "غرف النوم"}
          </p>
          <p className="text-sm">{+property.beds ? property.beds : "-"}</p>
        </div>
        <div className="flex flex-col items-center">
          <BiArea className="text-xl text-stone-500" />
          <p className="text-xs text-stone-500 arabic">
            {lang === "en" ? "Area" : "مساحة"}
          </p>
          <p className="text-sm">
            {+property.area ? property.area : "-"}{" "}
            {+property.area > 1 && <span className="text-xs">m²</span>}
          </p>
        </div>
        {property.category === "apartment" && (
          <div className="flex flex-col items-center">
            <PiBuildingsLight className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Floor" : "الدور"}
            </p>
            <p className="text-sm">
              {property.floor !== "N/A" ? property.floor : "-"}
            </p>
          </div>
        )}
      </div>
      {/* <p className={`text-xs mt-2 text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "About" : "تفاصيل"}
      </p>
      <pre className={`text-sm leading-snug font-sans font-medium text-wrap text-stone-700 mt-2 min-h-[44px] ${lang === "ar" && "text-right arabic"}`}>
        {lang === "en" ? property.about?.en ? property.about.en : '-' : property.about?.ar ? property.about.ar : '-'}
      </pre> */}
      <div className=" shadow-md rounded-md p-5 mb-1">
        <p
          className={`text-xs mt-2 text-stone-400 ${
            lang === "ar" && "text-right"
          }`}
        >
          {lang === "en" ? "Description" : "الوصف"}
        </p>
        <pre
          className={`text-sm leading-tight font-sans font-medium text-wrap text-stone-900 mt-2 min-h-[44px] ${
            lang === "ar" && "text-right arabic"
          }`}
        >
          {lang === "en" ? property.description.en : property.description.ar}
        </pre>
      </div>
    </div>
  );
}
