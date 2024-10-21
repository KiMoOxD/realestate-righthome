import { useAllContext } from "../context/AllContext";
import React, { lazy } from "react";
import img from "../images/landing.webp";
import { useEffect, useState } from "react";
import { getAllCollectionsData, regionOptionsAr, regionOptionsEn } from "../utils/data.js";
import { motion } from "framer-motion";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Select from "react-select";
import { FaWhatsapp } from "react-icons/fa";
const SearchItem = lazy(() => import("./SearchItem.jsx"));

const propertyTypes = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "House", value: "house" },
  { label: "Retail", value: "retail" },
];
const propertyTypesAr = [
  { label: "شقة", value: "apartment" },
  { label: "فيلا", value: "villa" },
  { label: "منزل", value: "house" },
  { label: "تجاري", value: "retail" },
];

const saleTypes = [
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
];

const saleTypesAr = [
  { label: "للبيع", value: "sale" },
  { label: "للايجار", value: "rent" },
];

export default function Hero() {
  let { lang } = useAllContext();
  let [SearchResult, setSearchResult] = useState([]);
  let [SearchData, setSearchData] = useState([]);
  let [status, setStatus] = useState();
  let [region, setRegion] = useState();
  let [type, setType] = useState();

  useEffect(() => {
    async function getData() {
      setTimeout(async () => {
        let data = await getAllCollectionsData();
        setSearchData(data);
      }, 2000);
    }
    getData();
  }, []);

  useEffect(() => {
    let results = SearchData;
    
    if (region) {
      results = results.filter(result => result.region.en === region.value.en)
    }
    if (status) {
      results = results.filter(result => result.status === status.value)
    }
    if (type) {
      results = results.filter(result => result.category === type.value)
    }
    if (!region && !type && !status) {
      results = []
    }

    setSearchResult(results.length > 0 ? results : "empty");
  }, [status, region, type, SearchData])

  return (
    <section
      className="relative flex items-center justify-center min-h-[80vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 z-2 bg-gray-900/50 sm:from-cyan-900/95 sm:to-gray-900/25"></div>
      <div className="relative p-2 text-center text-white w-[780px]">
        <p
          className="mt-3 sm:mt-0 text-4xl sm:text-6xl md:text-7xl font-semibold mb-5"
        >
          {lang === "en" ? "Find Your Dream Home" : "دور علي بيت احلامك"}
        </p>
        {lang === "en" && (
          <p className="max-w-lg text-sm mx-auto text-stone-200">
            Explore a world of amazing real estate opportunities and find the
            perfect home that meets all your needs and aspirations, where
            comfort and elegance are found in every corner of your dream house.
          </p>
        )}
        {lang === "ar" && (
          <p className="max-w-xl text-sm mx-auto mt-6 text-stone-200">
            استكشف فرص عقارية رائعة تجمع بين الفخامة والأسعار المناسبة للشباب
            والعائلات. هنا، تجد الراحة والأناقة في كل زاوية. انطلق في البحث عن
            بيت يناسب أسلوب حياتك وتطلعاتك!
          </p>
        )}
        <motion.form
          className={`relative bg-transparent text-sm rounded mt-6 text-stone-500`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {SearchResult === "empty" && (region || type || status) && (
            <div className="absolute top-[105%] hide-scrollbar left-0 overflow-scroll shadow-lg overflow-x-hidden w-full max-h-[200px] md:max-h-[300px] rounded bg-white flex flex-col gap-1 p-1">
              No Results
            </div>
          )}
          {SearchResult !== "empty" && SearchResult.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="absolute top-[105%] hide-scrollbar left-0 overflow-scroll shadow-lg overflow-x-hidden w-full max-h-[200px] md:max-h-[300px] rounded bg-white flex flex-col gap-1 p-1">
                {SearchResult?.map((result) => {
                  return <SearchItem result={result} />;
                })}
              </motion.div>
            ) : null}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 sm:gap-3 bg-white text-xs sm:text-sm p-1 sm:p-3 rounded">
            <Select
              options={lang === 'en' ? regionOptionsEn : regionOptionsAr}
              placeholder={lang === 'en' ? "Location..." : "المكان..."}
              onChange={(option) => setRegion(option)}
            />
            <Select
              options={lang === 'en' ? propertyTypes: propertyTypesAr}
              placeholder={lang === 'en' ? "Property..." : "العقار..."}
              onChange={(option) => setType(option)}
            />
            <Select
              options={lang === 'en' ? saleTypes : saleTypesAr}
              placeholder={lang === 'en' ? "Status..." : "الملكية..."}
              onChange={(option) => setStatus(option)}
            />
          </div>
        </motion.form>
        <div className="mt-5 flex gap-2 flex-col justify-center items-center">
          <p>Follow us!</p>
          <div className="flex gap-2 text-lg">
            <a
              href="https://m.facebook.com/profile.php?id=100064228025102&mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://wa.me/message/YZH6GC3MBKPRI1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-600"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.instagram.com/right.homee?igsh=MTV3bGJ3ampyejA3YQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-600"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
