import Hero from "../components/Hero";
import { useAllContext } from "../context/AllContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import { FiHome } from "react-icons/fi"; // Icon for the empty state
import { getCollectionData } from "../utils/data.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Component Imports
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard.jsx";
import TypesList from "../components/TypesList.jsx";

// Image & SVG Imports
import expIcon from "../images/experience.svg";
import decisionIcon from '../images/decision-making.svg';
import optimalIcon from '../images/best-practice.svg';
import reviewImg from '../images/reviews.png';
import sideImg from '../images/realestate.png';
import pattern from '../images/magicpattern.png';


export default function Home() {
  let { lang } = useAllContext();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  let [collectionType, setCollectionType] = useState('all');

  useEffect(() => {
    const fetchProps = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const propertiesData = await getCollectionData(collectionType);
        // We only need up to 6 properties for the homepage feature
        setProperties(propertiesData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching properties: ", error);
        setProperties([]); // In case of an error, ensure properties is an empty array
      } finally {
        setIsLoading(false); // Set loading to false after fetch is complete
      }
    };
    fetchProps();
  }, [collectionType]);

  // --- Helper components for cleaner rendering logic ---

  // A cleaner way to render skeleton loaders
  const renderSkeletons = () => (
    <div className="grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );

  // A more creative and friendly "empty state"
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-slate-100/50 rounded-2xl p-8 text-center">
        <FiHome className="mb-4 text-5xl text-blue-300"/>
        <p className="text-xl font-semibold text-slate-700">
            {lang === 'en' ? 'No Properties Found' : 'لم يتم العثور على عقارات'}
        </p>
        <p className="mt-1 text-slate-500">
            {lang === 'en' ? 'Please try another category or check back later.' : 'يرجى تجربة فئة أخرى أو التحقق مرة أخرى في وقت لاحق.'}
        </p>
    </div>
  );

  // The main grid for displaying properties
  const renderProperties = () => (
    <div className="grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );

  return (
    <div>
      <Hero />

      {/* ================================================================== */}
      {/* START: Enhanced Featured Properties Section                      */}
      {/* ================================================================== */}
      <section className="py-20 bg-slate-50">
        <div className="flex flex-col items-center justify-center max-w-screen-2xl mx-auto px-4">
          
          {/* --- Section Header --- */}
          <div className="text-center">
            <p className="font-semibold text-blue-600 uppercase tracking-wider">
              {lang === "en" ? 'Featured Properties' : 'عقارات مميزة'}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800 sm:text-5xl">
              {lang === "en" ? "For You" : "مـوصـي بـه لـك"}
            </h2>
          </div>
          
          <TypesList setCollectionType={setCollectionType} />

          {/* --- Main Content: Grid, Loader, or Empty State --- */}
          <div className="w-full mt-10">
            {isLoading
              ? renderSkeletons()
              : properties.length > 0
                ? renderProperties()
                : renderEmptyState()
            }
          </div>
          
          {/* --- "View All" Button --- */}
          {properties.length > 0 && (
             <Link
                to={"/browse"}
                // 'group' enables the hover effect on the icon
                className="group mt-12 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-105"
             >
                <span className="font-semibold">
                  {lang === 'en' ? 'View All Properties' : 'عرض جميع العقارات'}
                </span>
                {/* Icon moves slightly on hover for a dynamic feel */}
                <IoArrowForward className="transition-transform duration-300 group-hover:translate-x-1" />
             </Link>
          )}

        </div>
      </section>
      {/* ================================================================== */}
      {/* END: Enhanced Featured Properties Section                        */}
      {/* ================================================================== */}
      
      {/* --- Reviews Section --- */}
      <div className="relative flex gap-2 flex-col items-center mx-auto md:px-8 2xl:px-0 mb-10">
        <LazyLoadImage src={pattern} alt=""  className="absolute w-full h-full opacity-70"/>
        <LazyLoadImage src={reviewImg} alt="Reviews"  className="relative md:rounded-lg w-full lg:w-[65%] mt-10 drop-shadow-md"/>
        <div className="relative w-full flex gap-5 flex-col items-center justify-center my-10">
          <p className="text-2xl sm:text-3xl text-stone-800">
            {lang === 'en' ? 'Nice People Says About Us!' : '!آراء عملائنا عنا'}
          </p>
          <p className="text-sm sm:text-md text-stone-800">
            {lang === 'en' ? 'Please visit our FB page to see full reviews' : 'تفضل بزيارة صفحتنا على فيسبوك للاطلاع على جميع التقييمات'}
          </p>
          <a href="https://www.facebook.com/profile.php?id=100064228025102&sk=reviews" rel="noreferrer" target="_blank" className="bg-blue-600 text-white px-6 py-2 rounded text-sm sm:text-lg">
            {lang === 'en' ? 'See Full Reviews' : 'شاهد جميع التقييمات'}
          </a>
        </div>
      </div>

      {/* --- Benefits Section --- */}
      <div className="lg:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:rounded-2xl lg:mx-4 2xl:mx-auto overflow-hidden max-w-screen-2xl mb-10">
          <div className="overflow-hidden max-h-[600px] flex justify-center items-center">
            <LazyLoadImage
              effect="blur"
              width={700}
              src={sideImg}
              alt=""
            />
          </div>
          <div className="p-5 md:p-10 flex flex-col justify-center">
            <p className="text-xs text-blue-600 font-semibold mb-2">
              {lang === 'en' ? 'OUR BENEFIT' : 'مميزاتنا'}
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-stone-800 mb-4">
              {lang === 'en' ? 'Why to Choose Right Home' : 'ليه تختار "رايت هوم"؟'}
            </p>
            <p className="text-sm max-w-[500px] text-stone-500">
              {lang === 'en' ? `Our Seasoned team excels in real estate with years of successful
              market navigation, offering informed decisions and optimal results` : `فريقنا المتمرس يتفوق في مجال العقارات بسنوات من الخبرة الناجحة في السوق، مما يتيح لنا تقديم قرارات مستنيرة وتحقيق نتائج مثالية.`}
            </p>
            <div className="flex flex-col gap-2 mt-5">
              <div className="flex items-center gap-2 bg-white rounded-xl p-3">
                <img src={expIcon} alt="" className="w-12" />
                <div className="text-xs">
                  <p className="text-lg">{lang === 'en' ? 'Proven Expertise' : ' خبرة مثبته'}</p>
                  <p>
                    {lang === 'en' ? `Our Seasoned team excels in real estate with years of
                    successful market navigation, offering informed decisions
                    and optimal results` : `فريقنا المتمرس يتميز بخبرة طويلة في سوق العقارات، مما يمنحنا القدرة على التنقل بمرونة ونجاح في السوق، وتقديم قرارات مستنيرة تحقق أفضل النتائج.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-3">
                <img src={decisionIcon} alt="" className="w-12" />
                <div className="text-xs">
                  <p className="text-lg">{lang === 'en' ? 'Informed Decision-Making' : 'اتخاذ قرارات مدروسة'}</p>
                  <p>
                    {lang === 'en' ? `We guide you through every step, helping you make well-informed decisions based on current market trends and data.` : `نحن نرشدك في كل خطوة، ونساعدك على اتخاذ قرارات مبنية على أحدث اتجاهات السوق والبيانات المتاحة.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-3">
                <img src={optimalIcon} alt="" className="w-12" />
                <div className="text-xs">
                  <p className="text-lg">{lang === 'en' ? 'Optimal Results' : 'نتائج مثالية'}</p>
                  <p>
                    {lang === 'en' ? `With our in-depth market knowledge and strategic approach, we consistently achieve the best outcomes for our clients, whether buying, selling, or investing.` : `بفضل معرفتنا العميقة بالسوق ونهجنا الاستراتيجي، نحقق باستمرار أفضل النتائج لعملائنا سواء في الشراء، البيع، أو الاستثمار.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}