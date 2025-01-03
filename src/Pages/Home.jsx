import Hero from "../components/Hero";
import { useAllContext } from "../context/AllContext";
import expIcon from "../images/experience.svg";
import decisionIcon from '../images/decision-making.svg'
import optimalIcon from '../images/best-practice.svg'
import PropertyCard from "../components/PropertyCard";
import { useState, useEffect } from "react";
import { getCollectionData } from "../utils/data.js";
import SkeletonCard from "../components/SkeletonCard.jsx";
import TypesList from "../components/TypesList.jsx";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import reviewImg from '../images/reviews.png'
import sideImg from '../images/realestate.png'
import pattern from '../images/magicpattern.png'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";



export default function Home() {
  let { lang } = useAllContext();
  const [properties, setProperties] = useState([]);
  let [collectionType, setCollectionType] = useState('all')

  useEffect(() => {
    const fetchProps = async () => {
      try {
        let propertiesData = await getCollectionData(collectionType);
            propertiesData = propertiesData.slice(0, 6)
            setProperties(propertiesData.length === 0 ? 'empty' : propertiesData);
      } catch (error) {
        console.error("Error fetching apartments: ", error);
      }
    };
    fetchProps();
  }, [collectionType]);

  return (
    <div>
      <Hero />
      <div className="flex flex-col items-center justify-center py-10 max-w-screen-2xl mx-auto">
        <p className="text-md font-semibold text-blue-500 arabic-bold mx-auto mt-10">
          {lang === "en" ? 'Featured Properties' : 'عقارات مميزة'}
        </p>
        <p className="text-3xl font-semibold text-stone-800">
          {lang === "en" ? "Recommended for you" : "مـوصـي بـه لـك"}
        </p>
        <TypesList setCollectionType={setCollectionType} />
        
          {properties === 'empty' ? <p className="min-h-[150px] flex items-center">{lang === 'en' ? 'No Properties here yet': 'لا يوجد عقارات منشورة هنا بعد'}</p> : <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-3">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property } />
            ))
          ) : (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </div>}

        <Link
          to={"browse"}
          className="flex items-center gap-1 bg-blue-500 rounded-full text-white px-4 py-2 mt-6"
        >
          {lang === 'en' ? 'View All Properties' : 'عرض جميع العقارات'} <IoArrowForward />
        </Link>
      </div>
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
