import { useAllContext } from "../context/AllContext";
import React, { lazy } from 'react';
import img from "../images/landing.webp";
import { useEffect, useRef, useState } from "react";
import { getAllCollectionsData } from "../utils/data.js";
import { motion } from "framer-motion";
import debounce from 'lodash.debounce'; // Use lodash debounce to control the search frequency
// import SearchItem from "./SearchItem.jsx";
const SearchItem = lazy(() => import('./SearchItem.jsx'));


export default function Hero() {
  let { lang } = useAllContext();
  let [status, setStatus] = useState(1);
  let searchTextRef = useRef();
  let [SearchResult, setSearchResult] = useState([]);
  let [SearchData, setSearchData] = useState([]);

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
    setSearchResult([]);
  }, [status]);


  // Optimized handleSearch function
  const handleSearch = debounce(async (e) => {
    let searchText = e.target.value.trim().toLowerCase();
    
    if (searchText) {
      let final = SearchData.filter((res) =>
        status === 1 ? res.status === "sale" : res.status === "rent"
      );
  
      const results = final.filter((result) => {
        const descriptionEn = result.description.en.toLowerCase();
        const descriptionAr = result.description.ar.toLowerCase();
        const titleEn = result.title.en.toLowerCase();
        const titleAr = result.title.ar.toLowerCase();
        const regionEn = result.region.en.toLowerCase();
        const regionAr = result.region.ar.toLowerCase();
        
        // Prioritize title and region matches first for better relevance
        return (
          titleEn.includes(searchText) || 
          titleAr.includes(searchText) || 
          regionEn.includes(searchText) || 
          regionAr.includes(searchText) || 
          descriptionEn.includes(searchText) || 
          descriptionAr.includes(searchText) || 
          result.id.includes(searchText)
        );
      });
  
      // Sort by relevance: matches in title and region should appear before description matches
      const sortedResults = results.sort((a, b) => {
        const aTitleMatch = a.title.en.toLowerCase().includes(searchText) || a.title.ar.toLowerCase().includes(searchText);
        const bTitleMatch = b.title.en.toLowerCase().includes(searchText) || b.title.ar.toLowerCase().includes(searchText);
        const aRegionMatch = a.region.en.toLowerCase().includes(searchText) || a.region.ar.toLowerCase().includes(searchText);
        const bRegionMatch = b.region.en.toLowerCase().includes(searchText) || b.region.ar.toLowerCase().includes(searchText);
        
        // Sort by title match first, then region match
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        if (aRegionMatch && !bRegionMatch) return -1;
        if (!aRegionMatch && bRegionMatch) return 1;
        
        return 0;
      });
  
      // Update state based on whether results were found
      setSearchResult(sortedResults.length > 0 ? sortedResults : "empty");
    } else {
      setSearchResult([]);
    }
  }, 300); // The debounce delay in milliseconds
  

  return (
    <section
      className="relative flex items-center justify-center min-h-[80vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 z-2 bg-gray-900/50 sm:from-cyan-900/95 sm:to-gray-900/25"></div>
      <div className="relative p-2 text-center text-white w-[780px]">
        <motion.p
          className="mt-3 sm:mt-0 text-4xl sm:text-6xl md:text-7xl font-semibold mb-5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {lang === "en" ? "Find Your Dream Home" : "دور علي بيت احلامك"}
        </motion.p>
        {lang === "en" && (
          <p
            className="max-w-lg text-sm mx-auto text-stone-200"
          >
            Explore a world of amazing real estate opportunities and find the
            perfect home that meets all your needs and aspirations, where
            comfort and elegance are found in every corner of your dream house.
          </p>
        )}
        {lang === "ar" && (
          <p className="max-w-xl text-sm mx-auto mt-6 text-stone-200">
            استكشف فرص عقارية رائعة تجمع بين الفخامة والأسعار المناسبة للشباب والعائلات. هنا، تجد الراحة والأناقة في كل زاوية. انطلق في البحث عن بيت يناسب أسلوب حياتك وتطلعاتك!
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
              className="outline-none p-4 bg-white/90 text-black placeholder-stone-700 border rounded-full w-full"
              ref={searchTextRef}
              onChange={handleSearch}
            />
          </div>
        </motion.form>
      </div>
    </section>
  );
}
