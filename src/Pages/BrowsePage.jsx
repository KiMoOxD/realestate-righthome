import { useEffect, useRef, useState } from "react";
import { getCollectionData } from "../utils/data";
import Section from "../components/Browse/Section";
import Select from "react-select";
import { regionOptionsEn, regionOptionsAr } from "../utils/data";
import { useAllContext } from "../context/AllContext";
import PropertyCard from "../components/PropertyCard.jsx";
import { IoIosBed } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { BiMinus } from "react-icons/bi";
import { PiBathtubLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";

const LocationOptions = regionOptionsEn;
const ArLocationOptions = regionOptionsAr;

export default function BrowsePage() {
  let [properties, setProperties] = useState({
    villas: { rent: [], sale: [] },
    apartments: { rent: [], sale: [] },
    offices: { rent: [], sale: [] },
    studios: { rent: [], sale: [] },
    houses: { rent: [], sale: [] },
  });
  let [showFilters, setShowFilters] = useState(false);
  let { lang } = useAllContext();
  let [bedroomsCount, setBedroomsCount] = useState(1);
  let [bathroomsCount, setBathroomsCount] = useState(1);
  let [selectedRegion, setSelectedRegion] = useState(null);
  let [status, setStatus] = useState(1);
  let [selectedTypes, setSelectedTypes] = useState([]);
  let priceMinRef = useRef();
  let priceMaxRef = useRef();
  let [searchResult, setSearchResult] = useState([]);
  let [searchData, setSearchData] = useState([]);
  let [firstTime, setFirstTime] = useState(true);
  let [enabledFilters, setEnabledFilters] = useState({
    governate: false,
    bedrooms: false,
    bathrooms: false,
    priceRange: false,
  });

  useEffect(() => {
    async function getData() {
      let villasData = await getCollectionData("villas");
      let apartmentsData = await getCollectionData("apartments");
      let officesData = await getCollectionData("offices");
      let studiosData = await getCollectionData("studios");
      let housesData = await getCollectionData("houses");

      setProperties({
        villas: {
          rent: villasData.filter((villa) => villa.status === "rent").length === 0 ? 'empty' : villasData.filter((villa) => villa.status === "rent"),
          sale: villasData.filter((villa) => villa.status === "sale").length === 0 ? 'empty' : villasData.filter((villa) => villa.status === "sale"),
        },
        apartments: {
          rent: apartmentsData.filter((apartment) => apartment.status === "rent").length === 0 ? 'empty' : apartmentsData.filter((apartment) => apartment.status === "rent"),
          sale: apartmentsData.filter((apartment) => apartment.status === "sale").length === 0 ? 'empty' : apartmentsData.filter((apartment) => apartment.status === "sale"),
        },
        offices: {
          rent: officesData.filter((office) => office.status === "rent").length === 0 ? 'empty' : officesData.filter((office) => office.status === "rent"),
          sale: officesData.filter((office) => office.status === "sale").length === 0 ? 'empty' : officesData.filter((office) => office.status === "sale"),
        },
        studios: {
          rent: studiosData.filter((studio) => studio.status === "rent").length === 0 ? 'empty' : studiosData.filter((studio) => studio.status === "rent"),
          sale: studiosData.filter((studio) => studio.status === "sale").length === 0 ? 'empty' : studiosData.filter((studio) => studio.status === "sale"),
        },
        houses: {
          rent: housesData.filter((house) => house.status === "rent").length === 0 ? 'empty' : housesData.filter((house) => house.status === "rent"),
          sale: housesData.filter((house) => house.status === "sale").length === 0 ? 'empty' : housesData.filter((house) => house.status === "sale"),
        },
      });
      
      setSearchData([
        ...villasData,
        ...apartmentsData,
        ...officesData,
        ...studiosData,
        ...housesData,
      ]);
    }
    getData();
  }, []);

  function incBedroom() {
    setBedroomsCount((prev) => (prev < 6 ? prev + 1 : prev));
  }
  function decBedroom() {
    setBedroomsCount((prev) => (prev === 0 ? prev : prev - 1));
  }

  function incBathroom() {
    setBathroomsCount((prev) => (prev < 6 ? prev + 1 : prev));
  }

  function decBathroom() {
    setBathroomsCount((prev) => (prev === 0 ? prev : prev - 1));
  }

  function handleSelectedGovernate(option) {
    setSelectedRegion(option);
    console.log(option)
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedTypes((prev) => [...prev, value]);
    } else {
      setSelectedTypes((prev) => prev.filter((item) => item !== value));
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    let array = searchData;
    setFirstTime(false);
    setShowFilters(false)

    if (selectedTypes.length > 0) {
      array = array.filter((property) =>
        selectedTypes.includes(property.category)
      );
    }

    if (selectedRegion && enabledFilters.governate) {
      array = array.filter(
        (property) => property.region?.en === selectedRegion.value.en
      );
    }
    if (enabledFilters.priceRange) {
      if (priceMinRef.current?.value || priceMaxRef.current?.value) {
        if (priceMinRef.current?.value) {
          array = array.filter(
            (property) => +property.price >= +priceMinRef.current?.value
          );
        }
        if (priceMaxRef.current?.value) {
          array = array.filter(
            (property) => +property.price <= +priceMaxRef.current.value
          );
        }
      }
    }
    if (enabledFilters.bedrooms) {
      array = array.filter((property) => +property.beds === bedroomsCount);
    }
    if (enabledFilters.bathrooms) {
      array = array.filter((property) => +property.baths === bathroomsCount);
    }
    array = array.filter((property) =>
      status ? property.status === "sale" : property.status === "rent"
    );
    setSearchResult(array);
  }

  function toggleFilters() {
    setShowFilters((prev) => !prev);
  }

  function EnableFilters(e, type) {
    if (e.target.checked) {
      setEnabledFilters((prev) => {
        // Create a new copy of the previous state
        return {
          ...prev,
          [type]: true, // Update the specific filter
        };
      });
    } else {
      setEnabledFilters((prev) => {
        // Create a new copy of the previous state
        return {
          ...prev,
          [type]: false, // Update the specific filter
        };
      });
    }
  }

  return (
    <div className="min-h-[calc(100vh-114px)] max-w-screen-3xl px-0 pb-5 mx-auto">
      <div className="flex flex-col md:flex-row gap-2 mt-6">
        <form className={`p-5 border md:w-[350px]`} onSubmit={handleSubmit}>
          <div
            className={`flex justify-between items-center md:mb-3 ${
              showFilters && "mb-3"
            }`}
          >
            <p className="text-2xl ">{lang === "en" ? "Filter by" : "تخصيص"}</p>
            <button type="button" onClick={toggleFilters}>
              <VscSettings />
            </button>
          </div>
          <hr className={`${!showFilters && "hidden md:block"}`} />
          <div
            className={`flex gap-2 justify-center items-center my-5 ${
              !showFilters && "hidden md:flex"
            }`}
          >
            <button
              type="button"
              className={`w-20 py-1 ${
                status
                  ? "bg-blue-500 text-white"
                  : "bg-stone-200 hover:bg-blue-500 hover:text-white"
              } rounded-full`}
              onClick={() => setStatus(1)}
            >
              {lang === "en" ? "For Sale" : "للبيع"}
            </button>
            <button
              type="button"
              className={`w-20 py-1 ${
                !status
                  ? "bg-blue-500 text-white"
                  : "bg-stone-200 hover:bg-blue-500 hover:text-white"
              } rounded-full`}
              onClick={() => setStatus(0)}
            >
              {lang === "en" ? "For Rent" : "للايجار"}
            </button>
          </div>
          <hr className={`${!showFilters && "hidden md:block"}`} />
          <div className={`my-5 ${!showFilters && "hidden md:block"}`}>
            <p className="text-sm font-semibold">{lang==='en' ? 'Property Type':'نوع العقار'}</p>
            <div className="flex items-center my-0.5">
              <input
                id="apartment"
                type="checkbox"
                value="apartment"
                checked={selectedTypes.includes("apartment")}
                onChange={handleCheckboxChange}
                className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="apartment"
                className="ms-2 text-md font-medium text-gray-900 cursor-pointer"
              >
                {lang === "en" ? "Apartment" : "شقة"}
              </label>
            </div>
            <div className="flex items-center my-0.5">
              <input
                id="villa"
                type="checkbox"
                value="villa"
                checked={selectedTypes.includes("villa")}
                onChange={handleCheckboxChange}
                className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="villa"
                className="ms-2 text-md font-medium text-gray-900 cursor-pointer"
              >
                {lang === "en" ? "Villa" : "فيلا"}
              </label>
            </div>
            <div className="flex items-center my-0.5">
              <input
                id="house"
                type="checkbox"
                value="house"
                checked={selectedTypes.includes("house")}
                onChange={handleCheckboxChange}
                className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="house"
                className="ms-2 text-md font-medium text-gray-900 cursor-pointer"
              >
                {lang === "en" ? "House" : "منزل"}
              </label>
            </div>
            <div className="flex items-center my-0.5">
              <input
                id="office"
                type="checkbox"
                value="office"
                checked={selectedTypes.includes("office")}
                onChange={handleCheckboxChange}
                className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="office"
                className="ms-2 text-md font-medium text-gray-900 cursor-pointer"
              >
                {lang === "en" ? "Office" : "مكتب"}
              </label>
            </div>
            <div className="flex items-center my-0.5">
              <input
                id="studio"
                type="checkbox"
                value="studio"
                checked={selectedTypes.includes("studio")}
                onChange={handleCheckboxChange}
                className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="studio"
                className="ms-2 text-md font-medium text-gray-900 cursor-pointer"
              >
                {lang === "en" ? "Studio" : "ستوديو"}
              </label>
            </div>
          </div>
          <hr className={`${!showFilters && "hidden md:block"}`} />
          <div className={`my-5 ${!showFilters && "hidden md:block"}`}>
            <div className="flex justify-between items-center mb-2.5">
              <p className="text-sm font-semibold">
                {lang === "en" ? "Governate" : "المحافظة"}
              </p>
              <input
                type="checkbox"
                onChange={(e) => EnableFilters(e, "governate")}
                className="cursor-pointer"
              />
            </div>
            <Select
              options={lang === "en" ? LocationOptions : ArLocationOptions}
              //styles={customStyles}
              placeholder={lang === "en" ? "Select..." : "اختر..."}
              onChange={handleSelectedGovernate}
            />
          </div>
          <hr className={`${!showFilters && "hidden md:block"}`} />
          <div className={`my-5 ${!showFilters && "hidden md:block"}`}>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="bedrooms-input" className="text-sm font-semibold">
                {lang === "en" ? "Bedrooms" : "غرف النوم"}
              </label>
              <input
                type="checkbox"
                onChange={(e) => EnableFilters(e, "bedrooms")}
                className="cursor-pointer"
              />
            </div>
            <div className="relative flex items-center mt-2">
              <button
                type="button"
                onClick={decBedroom}
                className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11"
              >
                <BiMinus />
              </button>
              <input
                type="text"
                id="bedrooms-input"
                className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center outline-none text-gray-900 text-sm block w-full pb-6"
                value={bedroomsCount}
                required
              />
              <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                <IoIosBed className="w-3 h-3 text-gray-400" />
                <span>{lang === "en" ? "Bedrooms" : "غرف النوم"}</span>
              </div>
              <button
                type="button"
                onClick={incBedroom}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11"
              >
                <BiPlus />
              </button>
            </div>
          </div>
          <hr className={`${!showFilters && "hidden md:block"}`} />
          <div className={`my-5 ${!showFilters && "hidden md:block"}`}>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="bedrooms-input" className="text-sm font-semibold">
                {lang === "en" ? "Bathrooms" : "دورات المياة"}
              </label>
              <input
                type="checkbox"
                onChange={(e) => EnableFilters(e, "bathrooms")}
                className="cursor-pointer"
              />
            </div>
            <div className="relative flex items-center mt-2">
              <button
                type="button"
                onClick={decBathroom}
                className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11"
              >
                <BiMinus />
              </button>
              <input
                type="text"
                id="bathrooms-input"
                className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center outline-none text-gray-900 text-sm block w-full pb-6"
                value={bathroomsCount}
                required
              />
              <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                <PiBathtubLight className="w-3 h-3 text-gray-400" />
                <span>{lang === "en" ? "Bathrooms" : "دورات المياة"}</span>
              </div>
              <button
                type="button"
                onClick={incBathroom}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11"
              >
                <BiPlus />
              </button>
            </div>
          </div>
          <hr className={`${!showFilters && "hidden md:block"}`} />
          <div className={`my-5 ${!showFilters && "hidden md:block"}`}>
            <div className="flex justify-between items-center mb-2.5">
              <p className="text-sm font-semibold">
                {lang === "en" ? "Price Range" : "متوسط السعر"}
              </p>
              <input
                type="checkbox"
                onChange={(e) => EnableFilters(e, "priceRange")}
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                min={0}
                step={1000}
                placeholder={`${lang === "en" ? "Min" : "الحد الادني"}`}
                className="w-28 px-2 py-1 border outline-none rounded"
                ref={priceMinRef}
              />
              <span className="text-xl">-</span>
              <input
                type="number"
                min={0}
                step={10000}
                placeholder={`${lang === "en" ? "Max" : "الحد الاقصى"}`}
                className="w-28 px-2 py-1 border outline-none rounded"
                ref={priceMaxRef}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`text-sm mx-auto block bg-stone-100 border rounded p-2 ${
                !showFilters && "hidden md:block"
              }`}
            >
              Apply Filters
            </button>
          </div>
        </form>

        {searchResult.length > 0 && (
          <div className="px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3 mt-5">
            {searchResult.map((prop) => {
              return <PropertyCard key={prop.id} property={prop} />;
            })}
          </div>
        )}

        {searchResult.length === 0 && firstTime && (
          <div className="w-full bg-stone-50">
            <Section
              title={{ en: "Villas", ar: "فـيـلا" }}
              subtitle={{
                sale: { en: "Villas For Sale", ar: "فلل للبيع" },
                rent: { en: "Villas For Rent", ar: "فلل للايجار" },
              }}
              saleList={properties.villas.sale}
              rentList={properties.villas.rent}
            />

            <Section
              title={{ en: "Apartments", ar: "شقق" }}
              subtitle={{
                sale: { en: "Apartments For Sale", ar: "شقق للبيع" },
                rent: { en: "Apartments For Rent", ar: "شقق للايجار" },
              }}
              saleList={properties.apartments.sale}
              rentList={properties.apartments.rent}
            />

            {/* <Section
              title={{ en: "Offices", ar: "مكاتب" }}
              subtitle={{
                sale: { en: "Offices For Sale", ar: "مكاتب للبيع" },
                rent: { en: "Offices For Rent", ar: "مكاتب للايجار" },
              }}
              saleList={properties.offices.sale}
              rentList={properties.offices.rent}
            /> */}

            <Section
              title={{ en: "Studios", ar: "استوديوهات" }}
              subtitle={{
                sale: { en: "Studios For Sale", ar: "استوديوهات للبيع" },
                rent: { en: "Studios For Rent", ar: "استوديوهات للايجار" },
              }}
              saleList={properties.studios.sale}
              rentList={properties.studios.rent}
            />

            <Section
              title={{ en: "Houses", ar: "بيوت" }}
              subtitle={{
                sale: { en: "Houses For Sale", ar: "بيوت للبيع" },
                rent: { en: "Houses For Rent", ar: "بيوت للايجار" },
              }}
              saleList={properties.houses.sale}
              rentList={properties.houses.rent}
            />
          </div>
        )}
        {searchResult.length === 0 && !firstTime && (
          <div className="flex items-center justify-center w-full p-5">
            <p>No Search Results...</p>
          </div>
        )}
      </div>
    </div>
  );
}
