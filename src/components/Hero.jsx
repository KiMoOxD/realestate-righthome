import { useAllContext } from "../context/AllContext";
import img from "../images/landing.jpg";
import Select from "react-select";
import { CiSearch } from "react-icons/ci";
import governoratesEn from "../governate.json";
import governoratesAr from "../governateAr.json";
import { useState } from "react";

const TypeOptions = [
  { value: "1", label: "Apartement" },
  { value: "2", label: "House" },
  { value: "3", label: "Tower" },
];

const ArTypeOptions = [
  { value: "1", label: "شقة" },
  { value: "2", label: "منزل" },
  { value: "3", label: "برج" },
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
        <p className="max-w-xl text-sm mx-auto text-stone-200">
          {lang === "en"
            ? `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa tempore praesentium quos molestias aliquam, facere pariatur, suscipit quod, blanditiis dolorem et atque doloremque sit officiis sed corrupti ipsum. Ea, voluptate!
`
            : `استكشف عالماً من الفرص العقارية المذهلة وابحث عن المنزل المثالي الذي يلبي جميع احتياجاتك وتطلعاتك، حيث تجد الراحة والأناقة في كل زاوية من بيت أحلامك`}
        </p>
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
        <div className={`md:flex flex-wrap grid grid-cols-2 items-center bg-white gap-1 text-sm pt-3 pb-2 px-6 rounded-lg md:rounded-full mt-7 text-stone-500`}>
          <div className="flex flex-col gap-0.5 basis-1/4">
            <p className="self-start pl-2">
              {lang === "en" ? "Type" : "النوع"}
            </p>
            <Select
              options={lang === "en" ? TypeOptions : ArTypeOptions}
              styles={customStyles}
              placeholder={lang === 'en' ? 'Select...' : 'اختر...'}
            />
          </div>
          <div className="flex flex-col gap-0.5 basis-1/4">
            <p className="self-start pl-2">
              {lang === "en" ? "Governate" : "المحافظة"}
            </p>
            <Select
              options={lang === "en" ? LocationOptions : ArLocationOptions}
              styles={customStyles}
              placeholder={lang === 'en' ? 'Select...' : 'اختر...'}
            />
          </div>
          <div className="flex flex-grow flex-col col-span-2 gap-0.5">
            <p className="self-start pl-2">
              {lang === "en" ? "Search" : "بـحـث"}{" "}
            </p>
            <input
              type="text"
              className="outline-none p-2 border rounded-full"
            />
          </div>
          <button
            type="button"
            className="flex justify-center gap-1 col-span-2  items-center mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 md:ml-4 px-6 py-3 h-fit text-white rounded-full mb-2"
          >
            {lang === "en" ? "Search" : "ابحث"} <CiSearch className="text-lg" />
          </button>
        </div>
      </div>
    </section>
  );
}
