import { useAllContext } from "../context/AllContext";
import React, { lazy, useEffect, useState, useRef } from "react";
// --- MODIFIED: Import Link for navigation and Sparkles icon ---
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from 'lucide-react'; 
import img from "../images/landing.webp";
import { getAllCollectionsData } from "../utils/data.js";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaSearch } from "react-icons/fa";
import Select from "react-select";
import { LazyLoadImage } from "react-lazy-load-image-component";
const SearchItem = lazy(() => import("./SearchItem.jsx"));

// --- Data for Select Inputs ---
const propertyTypes = [
  { label: "Apartment", value: "apartment" }, { label: "Villa", value: "villa" },
  { label: "House", value: "house" }, { label: "Retail", value: "retail" },
];
const propertyTypesAr = [
  { label: "شقة", value: "apartment" }, { label: "فيلا", value: "villa" },
  { label: "منزل", value: "house" }, { label: "تجاري", value: "retail" },
];
const saleTypes = [
  { label: "For Sale", value: "sale" }, { label: "For Rent", value: "rent" },
];
const saleTypesAr = [
  { label: "للبيع", value: "sale" }, { label: "للايجار", value: "rent" },
];
const regionOptionsAr = [
  { label: "اكتوبر و زايد", value: "OZ" }, { label: "القاهرة الجديدة", value: "cairo" },
  { label: "العين السخنة", value: "sokhna" }, { label: "الساحل الشمالي", value: "NC" },
];
const regionOptionsEn = [
  { label: "October & Zayed", value: "OZ" }, { label: "New Cairo", value: "cairo" },
  { label: "Sokhna", value: "sokhna" }, { label: "North Coast", value: "NC" },
];

// --- Custom Styles for React-Select ---
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    minHeight: '48px',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
  }),
  placeholder: (provided) => ({ ...provided, color: 'rgba(255, 255, 255, 0.7)' }),
  singleValue: (provided) => ({ ...provided, color: 'white' }),
  multiValue: (provided) => ({ ...provided, backgroundColor: 'rgba(59, 130, 246, 0.5)' }),
  multiValueLabel: (provided) => ({ ...provided, color: 'white' }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.7)',
    ':hover': { backgroundColor: 'rgba(59, 130, 246, 0.7)', color: 'white' },
  }),
  input: (provided) => ({ ...provided, color: 'white' }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    zIndex: 30,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.3)' },
  }),
};

const regionMap = {
    OZ: ['October', 'Zayed'],
    NC: ['North Coast', 'New Alamein'],
    cairo: ['The Fifth Settlement', 'New Capital', 'Mostakbal City'],
    sokhna: ['Sokhna', 'Galala City', 'Gouna']
};


export default function Hero() {
  const { lang } = useAllContext();
  const navigate = useNavigate();

  const [searchResult, setSearchResult] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [status, setStatus] = useState(null);
  const [region, setRegion] = useState(null);
  const [type, setType] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchFormRef = useRef(null);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status.value);
    } else {
      params.set('status', 'sale');
    }
    if (type.length > 0) {
      type.forEach(t => params.append('type', t.value));
    }
    if (region) {
      const fullRegions = regionMap[region.value] || [];
      fullRegions.forEach(r => params.append('region', r));
    }
    navigate(`/browse?${params.toString()}`);
  };

  useEffect(() => {
    async function getData() {
      const timer = setTimeout(async () => {
        let data = await getAllCollectionsData();
        setSearchData(data);
      }, 1500);
      return () => clearTimeout(timer);
    }
    getData();
  }, []);

  useEffect(() => {
    let results = searchData;
    if (region) {
      const validRegions = regionMap[region.value] || [];
      if (validRegions.length > 0) {
          results = results.filter(result => result.region && validRegions.includes(result.region.en));
      }
    }
    if (status) {
      results = results.filter(result => result.status === status.value);
    }
    if (type.length > 0) {
      const typeValues = type.map(t => t.value);
      results = results.filter(result => typeValues.includes(result.category));
    }

    const hasFilters = region || status || type.length > 0;
    if (!hasFilters) {
      setSearchResult([]);
      setIsDropdownVisible(false);
    } else {
      setSearchResult(results.length > 0 ? results : "empty");
      setIsDropdownVisible(true);
    }
  }, [status, region, type, searchData]);

  useEffect(() => {
    function handleClickOutside(event) {
        if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
            setIsDropdownVisible(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchFormRef]);


  return (
    <section className="relative flex items-center justify-center min-h-[85vh]">
      <LazyLoadImage src={img} className="absolute w-full h-full top-0 left-0 object-cover" alt="background" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
      <div className="relative z-20 p-4 text-center text-white w-full max-w-4xl mx-auto">
        
        <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}
        >
          {lang === "en" ? "Find Your Dream Home" : "ابحث عن بيت أحلامك"}
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-sm mx-auto text-stone-200"
        >
          {lang === "en" 
            ? "Explore a world of real estate opportunities. Find the perfect home that meets all your needs and aspirations, where comfort and elegance live."
            : "استكشف فرص عقارية رائعة تجمع بين الفخامة والأسعار المناسبة للشباب والعائلات. هنا، تجد الراحة والأناقة في كل زاوية."
          }
        </motion.p>
        
        <motion.form
          ref={searchFormRef}
          onSubmit={handleSearchSubmit}
          className="relative mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
        >
          <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm p-3 rounded-xl">
            <Select options={lang === 'en' ? regionOptionsEn : regionOptionsAr} placeholder={lang === 'en' ? "Location..." : "المكان..."} onChange={setRegion} isClearable styles={customSelectStyles}/>
            <Select options={lang === 'en' ? propertyTypes: propertyTypesAr} placeholder={lang === 'en' ? "Property Type..." : "نوع العقار..."} onChange={setType} isMulti isClearable styles={customSelectStyles}/>
            <Select options={lang === 'en' ? saleTypes : saleTypesAr} placeholder={lang === 'en' ? "Status..." : "الحالة..."} onChange={setStatus} isClearable styles={customSelectStyles}/>
            
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              <FaSearch />
              <span className="font-semibold">{lang === 'en' ? 'Search' : 'ابحث'}</span>
            </button>
          </div>
          
          <AnimatePresence>
            {isDropdownVisible && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="z-10 absolute top-full mt-2 left-0 w-full max-h-80 overflow-y-auto hide-scrollbar rounded-lg shadow-2xl bg-slate-800/70 backdrop-blur-md border border-white/10 p-2"
              >
                {searchResult === "empty" ? (
                  <div className="p-4 text-center text-gray-300">{lang === 'en' ? 'No results found for your criteria.' : 'لا توجد نتائج تطابق بحثك.'}</div>
                ) : (
                  searchResult.map((result) => <SearchItem key={result.id} result={result} />)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* --- ADDED: AI Assistant Button --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-stone-300 mb-3">
            {lang === 'en' ? 'Or let our AI concierge find it for you' : 'أو دع مساعدنا الذكي يجدها لك'}
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-3 py-3 px-6 font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
            <span>{lang === 'en' ? 'Ask our AI Assistant' : 'اسأل مساعدنا الذكي'}</span>
          </Link>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} // Adjusted delay
            className="mt-8 flex gap-3 flex-col justify-center items-center"
        >
          <p className="text-sm text-stone-300">{lang === 'en' ? 'Follow us!' : 'تابعنا!'}</p>
          <div className="flex gap-4 text-lg">
            <a href="https://m.facebook.com/profile.php?id=100064228025102" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <FaFacebookF />
            </a>
            <a href="https://wa.me/message/YZH6GC3MBKPRI1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <FaWhatsapp />
            </a>
            <a href="https://www.instagram.com/right.homee?igsh=MTV3bGJ3ampyejA3YQ==" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <FaInstagram />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}