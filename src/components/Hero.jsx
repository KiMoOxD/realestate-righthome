import { useAllContext } from "../context/AllContext";
import img from "../images/landing.jpg";
import { useEffect, useRef, useState } from "react";
import { TextEffect } from "../components/TextEffect/TextEffectBase.tsx";
import { getAllCollectionsData } from "../utils/data.js";
import { motion } from "framer-motion";
import SearchItem from "./SearchItem.jsx";

export default function Hero() {
  let { lang } = useAllContext();
  let [status, setStatus] = useState(1);
  let searchTextRef = useRef();
  let [SearchResult, setSearchResult] = useState([]);
  let [SearchData, setSearchData] = useState([]);

  useEffect(() => {
    async function getData() {
      let data = await getAllCollectionsData();
      setSearchData(data);
    }
    getData();
  }, []);

  useEffect(() => {
    setSearchResult([]);
  }, [status]);

  async function handleSearch(e) {
    let final = SearchData;
    let searchText = e.target.value;
    if (searchText) {
      final = final
        .filter((res) =>
          status === 1 ? res.status === "sale" : res.status === "rent"
        )
        .filter((result) => {
          return (
            result.description.en
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            result.description.ar
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            result.title.en.toLowerCase().includes(searchText.toLowerCase()) ||
            result.title.ar.toLowerCase().includes(searchText.toLowerCase()) ||
            result.region.en.toLowerCase().includes(searchText.toLowerCase()) ||
            result.region.ar.toLowerCase().includes(searchText.toLowerCase()) ||
            result.id.includes(searchText)
          );
        });
      setSearchResult(final.length > 0 ? final : "empty");
    } else {
      setSearchResult([]);
    }
  }

  return (
    <section
      className="relative flex items-center justify-center min-h-[80vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 z-2 bg-gray-900/30 sm:from-cyan-900/95 sm:to-gray-900/25"></div>
      <div className="relative p-2 text-center text-white w-[780px]">
        <motion.p
          className="mt-3 sm:mt-0 text-4xl sm:text-6xl md:text-7xl font-semibold mb-5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {lang === "en" ? "Find Your Dream Home" : "دور علي بيت احلامك"}
        </motion.p>
        {lang === "en" && (
          <TextEffect
            per="word"
            preset="fade"
            className="max-w-lg text-sm mx-auto text-stone-200"
          >
            Explore a world of amazing real estate opportunities and find the
            perfect home that meets all your needs and aspirations, where
            comfort and elegance are found in every corner of your dream house.
          </TextEffect>
        )}
        {lang === "ar" && (
          <p className="max-w-xl text-sm mx-auto text-stone-200">
            استكشف عالماً من الفرص العقارية المذهلة وابحث عن المنزل المثالي الذي
            يلبي جميع احتياجاتك وتطلعاتك، حيث تجد الراحة والأناقة في كل زاوية من
            بيت أحلامك
          </p>
        )}
        <div className="relative flex justify-center gap-2 mt-10 bg-white w-fit mx-auto p-3 px-5 rounded-full ">
          <p className="absolute text-xs -top-6 px-2 py-1 rounded-t-2xl bg-blue-500">
            {lang === "en" ? "Choose Availability" : "اختر نوع الملكية"}
          </p>
          <motion.button
            type="button"
            className={`px-6 py-2 rounded-full relative border ${
              !status ? "border-blue-600 bg-white text-black" : "bg-blue-500"
            }`}
            onClick={() => setStatus(0)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            {lang === "en" ? "For Rent" : "للايجار"}
            {!status && (
              <div className="absolute top-full left-1/2 translate-x-[-50%] size-4 border-8 border-blue-500 border-l-transparent border-r-transparent border-b-transparent"></div>
            )}
          </motion.button>
          <motion.button
            type="button"
            className={`px-6 py-2 rounded-full relative border ${
              status ? "border-blue-600 bg-white text-black" : "bg-blue-500"
            }`}
            onClick={() => setStatus(1)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            {lang === "en" ? "For Sale" : "للـبيع"}
            {status === 1 && (
              <div className="absolute top-full left-1/2 translate-x-[-50%] size-4 border-8 border-blue-500 border-l-transparent border-r-transparent border-b-transparent"></div>
            )}
          </motion.button>
        </div>
        <motion.form
          className={`relative bg-transparent text-sm rounded-full mt-6 text-stone-500`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {SearchResult === "empty" ? (
            <div className="absolute top-[105%] hide-scrollbar left-0 overflow-scroll shadow-lg overflow-x-hidden w-full max-h-[200px] md:max-h-[300px] rounded-md lg:rounded-3xl bg-white flex flex-col gap-1 p-1">
              No Results
            </div>
          ) : SearchResult.length > 0 && (
            <div className="absolute top-[105%] hide-scrollbar left-0 overflow-scroll shadow-lg overflow-x-hidden w-full max-h-[200px] md:max-h-[300px] rounded-md lg:rounded-3xl bg-white flex flex-col gap-1 p-1">
              {SearchResult?.map((result) => {
                return <SearchItem result={result} />;
              })}
            </div>
          )}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none p-4 bg-white/80 text-black placeholder-stone-700 border rounded-full w-full"
              ref={searchTextRef}
              onChange={handleSearch}
            />
          </div>
        </motion.form>
      </div>
    </section>
  );
}
