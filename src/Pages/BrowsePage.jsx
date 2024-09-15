import { useEffect, useState } from "react";
import { getCollectionData } from "../utils/data";
import Section from "../components/Browse/Section";
import Select from "react-select";
import governoratesEn from "../governate.json";
import governoratesAr from "../governateAr.json";
import governatesMap from "../governatesmap.json";
import { useAllContext } from "../context/AllContext";
import SkeletonCard from "../components/SkeletonCard.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { IoIosBed } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { BiMinus } from "react-icons/bi";
import { PiBathtubLight } from "react-icons/pi";


const LocationOptions = governoratesEn;
const ArLocationOptions = governoratesAr;

export default function BrowsePage() {
  let [properties, setProperties] = useState({
    villas: { rent: [], sale: [] },
    apartments: { rent: [], sale: [] },
    offices: { rent: [], sale: [] },
    studios: { rent: [], sale: [] },
    houses: { rent: [], sale: [] },
  });
  let { lang } = useAllContext();
  let [bedroomsCount, setBedroomsCount]  = useState(1)
  let [bathroomsCount, setBathroomsCount]  = useState(1)
  let [selectedGovernate, setSelectedGovernate] = useState(null);


  useEffect(() => {
    async function getData() {
      let villasData = await getCollectionData("villas");
      let apartmentsData = await getCollectionData("apartments");
      let officesData = await getCollectionData("offices");
      let studiosData = await getCollectionData("studios");
      let housesData = await getCollectionData("houses");

      setProperties({
        villas: {
          rent: villasData.filter((villa) => villa.status === "rent"),
          sale: villasData.filter((villa) => villa.status === "sale"),
        },
        apartments: {
          rent: apartmentsData.filter(
            (apartment) => apartment.status === "rent"
          ),
          sale: apartmentsData.filter(
            (apartment) => apartment.status === "rent"
          ),
        },
        offices: {
          rent: officesData.filter((office) => office.status === "rent"),
          sale: officesData.filter((office) => office.status === "sale"),
        },
        studios: {
          rent: studiosData.filter((studio) => studio.status === "rent"),
          sale: studiosData.filter((studio) => studio.status === "sale"),
        },
        houses: {
          rent: housesData.filter((house) => house.status === "rent"),
          sale: housesData.filter((house) => house.status === "sale"),
        },
      });
    }
    getData();
  }, []);

  function incBedroom() {
    setBedroomsCount(prev => prev < 6 ? prev+1 : prev)
  }
  function decBedroom() {
    setBedroomsCount(prev => prev === 1 ? prev : prev-1)
  }

  function incBathroom() {
    setBathroomsCount(prev => prev < 6 ? prev+1 : prev)
  }

  function decBathroom() {
    setBathroomsCount(prev => prev === 1 ? prev : prev-1)
  }

  function handleSelectedGovernate(option) {
    setSelectedGovernate(governatesMap[option.value].governate.en);
  }

  return (
    <div className="min-h-[calc(100vh-114px)] max-w-screen-3xl px-4 pb-5 mx-auto">
      <div className="flex flex-col md:flex-row gap-2 mt-10">
        <form className="p-5 border md:w-[350px]">
          <div className="flex gap-2 justify-center items-center mb-5">
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded-full"
            >
              For Sale
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-stone-200 hover:bg-blue-500 hover:text-white rounded-full"
            >
              For Rent
            </button>
          </div>
          <hr />
          <div className="my-5">
            <p className="text-sm mb-2.5 font-semibold">
              Property Type
            </p>
            <div className="flex items-center my-0.5">
              <input id="apartment" type="checkbox" value="" className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"/>
              <label htmlFor="apartment" className="ms-2 text-md font-medium text-gray-900 cursor-pointer">Apartment</label>
            </div>
            <div className="flex items-center my-0.5">
              <input id="villa" type="checkbox" value="" className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"/>
              <label htmlFor="villa" className="ms-2 text-md font-medium text-gray-900 cursor-pointer">Villa</label>
            </div>
            <div className="flex items-center my-0.5">
              <input id="house" type="checkbox" value="" className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"/>
              <label htmlFor="house" className="ms-2 text-md font-medium text-gray-900 cursor-pointer">House</label>
            </div>
            <div className="flex items-center my-0.5">
              <input id="office" type="checkbox" value="" className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"/>
              <label htmlFor="office" className="ms-2 text-md font-medium text-gray-900 cursor-pointer">Office</label>
            </div>
            <div className="flex items-center my-0.5">
              <input id="studio" type="checkbox" value="" className="w-3.5 h-3.5 text-blue-500 bg-gray-100 border-gray-300 rounded cursor-pointer"/>
              <label htmlFor="studio" className="ms-2 text-md font-medium text-gray-900 cursor-pointer">Studio</label>
            </div>
          </div>
          <hr />
          <div className="my-5">
            <p className="text-sm mb-2.5 font-semibold">
              Governate
            </p>
            <Select
              options={lang === "en" ? LocationOptions : ArLocationOptions}
              //styles={customStyles}
              placeholder={lang === "en" ? "Select..." : "اختر..."}
              onChange={handleSelectedGovernate}
            />
          </div>
          <hr />
          <div className="my-5">
            <label htmlFor="bedrooms-input" className="text-sm mb-4 font-semibold">Bedrooms</label>
            <div className="relative flex items-center mt-2">
                <button type="button" onClick={decBedroom} className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11">
                  <BiMinus/>
                </button>
                <input type="text" id="bedrooms-input"  className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center outline-none text-gray-900 text-sm block w-full pb-6" value={bedroomsCount} required />
                <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <IoIosBed className="w-3 h-3 text-gray-400"/>
                    <span>Bedrooms</span>
                </div>
                <button type="button" onClick={incBedroom} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11">
                  <BiPlus/>
                </button>
            </div>
          </div>
          <hr />
          <div className="my-5">
            <label htmlFor="bathrooms-input" className="text-sm mb-4 font-semibold">Bathrooms</label>
            <div className="relative flex items-center mt-2">
                <button type="button" onClick={decBathroom} className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11">
                  <BiMinus/>
                </button>
                <input type="text" id="bathrooms-input"  className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center outline-none text-gray-900 text-sm block w-full pb-6" value={bathroomsCount} required />
                <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <PiBathtubLight className="w-3 h-3 text-gray-400"/>
                    <span>Bathrooms</span>
                </div>
                <button type="button" onClick={incBathroom} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11">
                  <BiPlus/>
                </button>
            </div>
          </div>
          <hr />
          <div className="my-5">
            <p className="text-sm mb-2.5 font-semibold">
              Price Range
            </p>
            <div className="flex items-center justify-center gap-5">
              <input type="text" placeholder="Min" className="w-20 px-2 py-1 border outline-none rounded"/>
              <span className="text-xl">-</span>
              <input type="text" placeholder="Max" className="w-20 px-2 py-1 border outline-none rounded"/>
            </div>
          </div>
        </form>
        <div className="px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3 mt-5">
          {properties.apartments.sale.length > 0 ? (
            properties.apartments.sale.map((prop) => {
              return <PropertyCard key={prop.id} property={prop} />;
            })
          ) : (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </div>
      </div>

      <Section
        title={{ en: "Villas", ar: "فـيـلا" }}
        subtitle={{
          sale: { en: "Villas htmlFor Sale", ar: "فلل للبيع" },
          rent: { en: "Villas htmlFor Rent", ar: "فلل للايجار" },
        }}
        saleList={properties.villas.sale}
        rentList={properties.villas.rent}
      />

      <Section
        title={{ en: "Apartments", ar: "شقق" }}
        subtitle={{
          sale: { en: "Apartments htmlFor Sale", ar: "شقق للبيع" },
          rent: { en: "Apartments htmlFor Rent", ar: "شقق للايجار" },
        }}
        saleList={properties.apartments.sale}
        rentList={properties.apartments.rent}
      />

      <Section
        title={{ en: "Offices", ar: "مكاتب" }}
        subtitle={{
          sale: { en: "Offices htmlFor Sale", ar: "مكاتب للبيع" },
          rent: { en: "Offices htmlFor Rent", ar: "مكاتب للايجار" },
        }}
        saleList={properties.offices.sale}
        rentList={properties.offices.rent}
      />

      <Section
        title={{ en: "Studios", ar: "استوديوهات" }}
        subtitle={{
          sale: { en: "Studios htmlFor Sale", ar: "استوديوهات للبيع" },
          rent: { en: "Studios htmlFor Rent", ar: "استوديوهات للايجار" },
        }}
        saleList={properties.studios.sale}
        rentList={properties.studios.rent}
      />

      <Section
        title={{ en: "Houses", ar: "بيوت" }}
        subtitle={{
          sale: { en: "Houses htmlFor Sale", ar: "بيوت للبيع" },
          rent: { en: "Houses htmlFor Rent", ar: "بيوت للايجار" },
        }}
        saleList={properties.houses.sale}
        rentList={properties.houses.rent}
      />
    </div>
  );
}
