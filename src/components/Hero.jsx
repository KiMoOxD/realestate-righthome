import { useAllContext } from "../context/AllContext";
import img from "../images/landing.jpg";
import Select from "react-select";
import { CiSearch } from "react-icons/ci";
import governoratesEn from "../governate.json";
import governoratesAr from "../governateAr.json";
import { useRef, useState } from "react";
import { TextEffect } from "../components/TextEffect/TextEffectBase.tsx";
import { getAllCollectionsData, getCollectionData } from "../utils/data.js";
import governatesMap from "../governatesmap.json";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { Link } from "react-router-dom";

const TypeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "office", label: "Office" },
  { value: "villa", label: "Villa" },
];

const ArTypeOptions = [
  { value: "apartment", label: "شقة" },
  { value: "house", label: "منزل" },
  { value: "studio", label: "استوديو" },
  { value: "office", label: "مكتب" },
  { value: "villa", label: "فيلا" },
];

const LocationOptions = governoratesEn;
const ArLocationOptions = governoratesAr;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "none", // Remove the border
    boxShadow: "none", // Remove box shadow on focus
    "&:hover": {
      boxShadow: "none", // Remove hover effect on input
    },
    textAlign: "left", // Ensure text aligns to the left
  }),
  placeholder: (provided) => ({
    ...provided,
    textAlign: "left", // Align placeholder text to the left
    color: "black", // Change placeholder text color to black
  }),
  singleValue: (provided) => ({
    ...provided,
    textAlign: "left", // Align selected option text to the left
    color: "black", // Change selected text color to black
  }),
  option: (provided, state) => ({
    ...provided,
    color: "black", // Change the color of the options text to black
    backgroundColor: state.isSelected
      ? "#f0f0f0"
      : state.isFocused
      ? "#e6e6e6"
      : "white", // Highlight selected and hovered option
    textAlign: "left", // Align option text to the left
    "&:hover": {
      backgroundColor: "#e6e6e6", // Add hover effect on options
    },
  }),
};

export default function Hero() {
  let { lang } = useAllContext();
  let [status, setStatus] = useState(1);
  let [selectedType, setSelectedType] = useState(null);
  let [selectedGovernate, setSelectedGovernate] = useState(null);
  let searchTextRef = useRef();
  let [SearchResult, setSearchResult] = useState([]);

  function handleSelectedType(option) {
    setSelectedType(option.value);
  }

  function handleSelectedGovernate(option) {
    setSelectedGovernate(governatesMap[option.value].governate.en);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let searchResult = [];
    console.log(
      status,
      selectedType,
      selectedGovernate,
      searchTextRef.current.value
    );

    if (!selectedType) {
      searchResult = await getAllCollectionsData();
      if (selectedGovernate)
        searchResult = searchResult.filter(
          (result) => result.governate.en === selectedGovernate
        );
      searchResult = searchResult.filter(
        (result) => result.status === (status === 1 ? "sale" : "rent")
      );
    } else {
      searchResult = await getCollectionData(selectedType + "s");
      if (selectedGovernate)
        searchResult = searchResult.filter(
          (result) => result.governate.en === selectedGovernate
        );
      searchResult = searchResult.filter(
        (result) => result.status === (status === 1 ? "sale" : "rent")
      );
    }
    if (searchTextRef.current.value) {
      searchResult = searchResult.filter((result) => {
        return (
          result.description.en.includes(searchTextRef.current.value) ||
          result.description.ar.includes(searchTextRef.current.value) ||
          result.title.en.includes(searchTextRef.current.value) ||
          result.title.ar.includes(searchTextRef.current.value)
        );
      });
    }
    console.log(searchResult);
    setSearchResult(searchResult);
  }

  return (
    <section
      className="relative flex items-center justify-center min-h-[80vh]  bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 z-2 bg-gray-900/30 sm:from-cyan-900/95 sm:to-gray-900/25"></div>
      <div className="relative p-2 text-center text-white w-[780px]">
        <p className="mt-3 sm:mt-0 text-5xl sm:text-6xl md:text-7xl font-semibold mb-5">
          {lang === "en" ? "Find Your Dream Home" : "دور علي بيت احلامك"}
        </p>
        {lang === "en" && (
          <TextEffect
            per="word"
            preset="fade"
            className="max-w-xl text-sm mx-auto text-stone-200"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
            tempore praesentium quos molestias aliquam, facere pariatur,
            suscipit quod, blanditiis dolorem et atque doloremque sit officiis
            sed corrupti ipsum. Ea, voluptate!
          </TextEffect>
        )}
        {lang === "ar" && (
          <p className="max-w-xl text-sm mx-auto text-stone-200">
            استكشف عالماً من الفرص العقارية المذهلة وابحث عن المنزل المثالي الذي
            يلبي جميع احتياجاتك وتطلعاتك، حيث تجد الراحة والأناقة في كل زاوية من
            بيت أحلامك
          </p>
        )}
        <div className="relative flex justify-center gap-2 mt-12">
          <button
            type="button"
            className="bg-blue-500 px-6 py-2 rounded-full relative"
            onClick={() => setStatus(0)}
          >
            {lang === "en" ? "For Rent" : "للايجار"}
            {!status && (
              <div className="absolute top-full left-1/2 translate-x-[-50%] size-4 border-8 border-blue-500 border-l-transparent border-r-transparent border-b-transparent"></div>
            )}
          </button>
          <button
            type="button"
            className="bg-blue-500 px-6 py-2 rounded-full relative"
            onClick={() => setStatus(1)}
          >
            {lang === "en" ? "For Sale" : "للـبيع"}
            {status === 1 && (
              <div className="absolute top-full left-1/2 translate-x-[-50%] size-4 border-8 border-blue-500 border-l-transparent border-r-transparent border-b-transparent"></div>
            )}
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`relative md:flex flex-wrap grid grid-cols-2 items-center bg-white gap-1 text-sm pt-3 pb-2 px-6 rounded-lg md:rounded-full mt-7 text-stone-500`}
        >
          {SearchResult.length > 0 && (
            <div className="absolute top-[105%] hide-scrollbar left-0 overflow-scroll shadow-lg overflow-x-hidden w-full max-h-[200px] md:max-h-[300px] rounded-md lg:rounded-3xl bg-white flex flex-col gap-1 p-1">
              {SearchResult.map((result) => {
                return (
                  <Link
                    to={`/browse/${result.category}s/${result.id}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 cursor-pointer"
                  >
                    <img
                      src={result.images[0]}
                      alt=""
                      className="w-10 lg:w-14 rounded"
                    />
                    <div className="text-left flex-grow text-xs lg:text-sm">
                      <p className="truncate max-w-[140px] md:max-w-full">
                        {result.title.en}
                      </p>
                      <p>{result.price}</p>
                    </div>
                    <div>
                      <p className="text-right text-xs lg:text-sm">
                        {result.governate.en}
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
              })}
            </div>
          )}
          <div className="flex flex-col gap-0.5 basis-1/4">
            <p className="self-start pl-2">
              {lang === "en" ? "Type" : "النوع"}
            </p>
            <Select
              options={lang === "en" ? TypeOptions : ArTypeOptions}
              styles={customStyles}
              placeholder={lang === "en" ? "Select..." : "اختر..."}
              onChange={handleSelectedType}
            />
          </div>
          <div className="flex flex-col gap-0.5 basis-1/4">
            <p className="self-start pl-2">
              {lang === "en" ? "Governate" : "المحافظة"}
            </p>
            <Select
              options={lang === "en" ? LocationOptions : ArLocationOptions}
              styles={customStyles}
              placeholder={lang === "en" ? "Select..." : "اختر..."}
              onChange={handleSelectedGovernate}
            />
          </div>
          <div className="flex flex-grow flex-col col-span-2 gap-0.5">
            <p className="self-start pl-2">
              {lang === "en" ? "Search" : "بـحـث"}{" "}
            </p>
            <input
              type="text"
              className="outline-none p-2 border rounded-full"
              ref={searchTextRef}
            />
          </div>
          <button
            type="submit"
            className="flex justify-center gap-1 col-span-2  items-center mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 md:ml-4 px-6 py-3 h-fit text-white rounded-full mb-2"
          >
            {lang === "en" ? "Search" : "ابحث"} <CiSearch className="text-lg" />
          </button>
        </form>
      </div>
    </section>
  );
}
