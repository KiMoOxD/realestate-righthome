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
//   let [showNumber, setShowNumber] = useState(false);
//   let pathName = useLocation();
//   let phoneNumber = "+201019363939";
//   let message = `
// Hello,\n
// I would like to get more information about this property:\n
// Type: ${property.category}\n
// Location: ${property.region.en}\n
// Link: https://realestate-righthome-553z.vercel.app${pathName.pathname}\n
// `;

  console.log(property)
  return (
    <div className="max-w-full w-full md:w-[100%] lg:max-w-[800px] xl:max-w-[900px] mt-5 order-2 flex flex-col">
      <div className={`flex gap-2 ${lang === "ar" && "justify-end arabic"}`}>
        <p className={`text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit`}>
          {property.category?.toUpperCase()}{' '}
          {property.category === 'apartment' && '('+ property.apartmentType?.toUpperCase() +')'}
          {property.category === 'retail' && '('+ property.retailType?.toUpperCase() +')'}
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
      <p className={`text-xs text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "Price" : "الـسعر"}
      </p>
      <p
        className={`relative font-semibold text-2xl ${
          lang === "ar" ? "text-right" : ""
        }`}
      >
        {lang === "en"
          ? !isNaN(property.price) ? `${formattedPriceEn.format(property.price).replace("$", "")} EGP` : 'Contact for price'
          : !isNaN(property.price) ? formattedPriceAR.format(property.price) : 'تواصل لمعرفة السعر'}

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

        {property.rentType !== 'N/A' && property.status === "rent" && (
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
                ? property.downPayment ? `${formattedPriceEn.format(property.downPayment).replace("$", "")} EGP` : '-'
                : property.downPayment ? formattedPriceAR.format(property.downPayment) : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <GiProgression className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Duration (Year)" : "(سنة) مدة التقسيط"}
            </p>
            <p className="text-sm">{property.insYears ? property.insYears : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <HiOutlineCollection className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Installment Type" : "نوع التقسيط"}
            </p>
            <p className="text-sm">{property.insType ? property.insType : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <HiOutlineBadgeCheck className="text-xl text-stone-500" />
            <p className="text-xs text-stone-500 arabic">
              {lang === "en" ? "Handover Date (Years)" : "(سنة) مدة الاستلام"}
            </p>
            <p className="text-sm">{property.recieveDate ? property.recieveDate : '-'}</p>
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
            <p className="text-sm">{property.floor !== 'N/A' ? property.floor : "-"}</p>
          </div>
        )}
      </div>
      <p className={`text-xs text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "About" : "تفاصيل"}
      </p>
      <pre className={`bg-stone-100 text-sm p-3 text-wrap text-stone-700 mt-2 min-h-[44px] ${lang === "ar" && "text-right arabic"}`}>
        {lang === "en" ? property.about?.en ? property.about.en : '-' : property.about?.ar ? property.about.ar : '-'}
      </pre>
      <p className={`text-xs text-stone-400 ${lang === "ar" && "text-right"}`}>
        {lang === "en" ? "Description" : "الوصف"}
      </p>
      <pre
        className={`bg-stone-100 text-sm p-3 text-wrap text-stone-700 mt-2 ${
          lang === "ar" && "text-right arabic"
        }`}
      >{lang === "en" ? property.description.en : property.description.ar}</pre>
      {/* <hr className="my-2" />
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
              <motion.a
                key="phone-text"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                className="flex gap-2 items-center"
                href={`tel:${phoneNumber}`}
              >
                <IoIosCall className="text-2xl" /> Phone Number
              </motion.a>
            ) : (
              <motion.span
                key="phone-number"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                className="py-0.5 md:py-0"
              >
                +201145034531
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div> */}
    </div>
  );
}
