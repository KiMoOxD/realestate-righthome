import { useState } from "react";
import { useAllContext } from "../context/AllContext";

export default function TypesList({ setCollectionType }) {
    let { lang } = useAllContext();
    let [isSelected, setIsSelected] = useState('all')
    function handleClick(id) {
      setCollectionType(id)
      setIsSelected(id)
    }

  return (
    <div className="flex flex-wrap justify-center px-4 gap-3 items-center my-6 *:transition text-sm">
      <button
        type="button"
        onClick={() => handleClick('all')}
        className={`px-4 py-1 ${isSelected === 'all' ? 'bg-blue-500 text-white' : "bg-stone-100"} rounded-full hover:bg-blue-400 hover:text-white`}
      >
        {lang === "en" ? "View All" : "الـكـل"}
      </button>
      <button
        type="button"
        onClick={() => handleClick('apartments')}
        className={`px-4 py-1 ${isSelected === 'apartments' ? 'bg-blue-500 text-white' : "bg-stone-100"} rounded-full hover:bg-blue-400 hover:text-white`}
      >
        {lang === "en" ? "Apartment" : "شـقـة"}
      </button>
      <button
        type="button"
        onClick={() => handleClick('villas')}
        className={`px-4 py-1 ${isSelected === 'villas' ? 'bg-blue-500 text-white' : "bg-stone-100"} rounded-full hover:bg-blue-400 hover:text-white`}
      >
        {lang === "en" ? "Villa" : "فـيـلا"}
      </button>
      <button
        type="button"
        onClick={() => handleClick('retails')}
        className={`px-4 py-1 ${isSelected === 'studios' ? 'bg-blue-500 text-white' : "bg-stone-100"} rounded-full hover:bg-blue-400 hover:text-white`}
      >
        {lang === "en" ? "Retail" : "تجاري"}
      </button>
      <button
        type="button"
        onClick={() => handleClick('houses')}
        className={`px-4 py-1 ${isSelected === 'houses' ? 'bg-blue-500 text-white' : "bg-stone-100"} rounded-full hover:bg-blue-400 hover:text-white`}
      >
        {lang === "en" ? "House" : "منزل"}
      </button>
      {/* <button
        type="button"
        onClick={() => handleClick('offices')}
        className={`px-4 py-1 ${isSelected === 'offices' ? 'bg-blue-500 text-white' : "bg-stone-100"} rounded-full hover:bg-blue-400 hover:text-white`}
      >
        {lang === "en" ? "Office" : "مكتب"}
      </button> */}
    </div>
  );
}
