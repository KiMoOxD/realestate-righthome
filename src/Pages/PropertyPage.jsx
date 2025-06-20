import { Link, useLoaderData, useParams } from "react-router-dom";
import { getCollectionData, getDocumentData } from "../utils/data"; // Assuming this path is correct
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Import your page-specific and reusable components
import ImageSlider from "../components/ImageSlider";
import PropertyInfo from "../components/PropertyPage/PropertyInfo";
import CallInfo from "../components/PropertyPage/CallInfo";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { useAllContext } from "../context/AllContext"; // Assuming this path is correct

// Import new/helper components and icons
import { HiPhoto } from 'react-icons/hi2';
import { IoChevronForward } from "react-icons/io5";

// --- Child Components (can be in separate files) ---

function ImageGalleryGrid({ images, openImageSlider }) {
  const displayImages = images.slice(0, 5);
  const remainingImagesCount = images.length > 5 ? images.length - 5 : 0;

  if (!images || images.length === 0) {
    return <div className="w-full h-[300px] md:h-[550px] bg-stone-200 rounded-2xl flex items-center justify-center"><p className="text-stone-500">No images available</p></div>;
  }

  return (
    <motion.div 
      className="relative w-full h-[300px] md:h-[550px] overflow-hidden rounded-2xl cursor-pointer group"
      onClick={openImageSlider}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-2">
        <div className="col-span-4 md:col-span-2 row-span-2 overflow-hidden">
          <img src={displayImages[0]} alt="Main property view" className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
        </div>
        {displayImages.slice(1).map((src, index) => (
          <div key={index} className="hidden md:block col-span-1 row-span-1 overflow-hidden">
            <img src={src} alt={`Property view ${index + 2}`} className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-5 right-5">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-stone-800 text-sm font-semibold rounded-lg shadow-lg hover:bg-white transition-colors"
          onClick={(e) => { e.stopPropagation(); openImageSlider(); }}
        >
          <HiPhoto />
          Show all photos {remainingImagesCount > 0 && `(+${remainingImagesCount})`}
        </button>
      </div>
    </motion.div>
  );
}

const Breadcrumbs = ({ property, lang }) => (
  <motion.div 
    className={`flex items-center gap-2 text-sm text-stone-500 mb-4 flex-wrap ${lang === 'ar' && 'flex-row-reverse'}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <Link to="/" className="hover:text-sky-600">Home</Link>
    <IoChevronForward className="flex-shrink-0" />
    <Link to={`/${property.collection}`} className="hover:text-sky-600 capitalize">{property.collection}</Link>
    <IoChevronForward className="flex-shrink-0" />
    <span className="text-stone-800 font-medium truncate max-w-[150px] sm:max-w-xs">{lang === 'en' ? property.title.en : property.title.ar}</span>
  </motion.div>
);


// --- MAIN PAGE COMPONENT ---
export default function PropertyPage() {
  const property = useLoaderData();
  const params = useParams();
  const { lang } = useAllContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [similarProperties, setSimilarProperties] = useState({ isLoading: true, data: [] });

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchSimilar() {
      if (!property) return;
      setSimilarProperties({ isLoading: true, data: [] });
      try {
        const data = await getCollectionData(params.collection);
        const filteredData = data.filter((item) => item.id !== params.id);
        setSimilarProperties({ isLoading: false, data: filteredData });
      } catch (error) {
        console.error("Failed to fetch similar properties:", error);
        setSimilarProperties({ isLoading: false, data: [] });
      }
    }
    fetchSimilar();
  }, [params.collection, params.id, property]);

  if (!property) {
    return (
      <div className="p-5 flex flex-col justify-center items-center min-h-[calc(100vh-114px)] text-center">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Page Not Found</h1>
        <p className="text-stone-600 mb-8">The property you are looking for might have been moved or does not exist.</p>
        <Link to="/" className="text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <ImageSlider imgs={property.images} modal={isModalOpen} setModal={setIsModalOpen} />
      <div className="bg-white">
        <main className="max-w-screen-2xl mx-auto p-4 md:p-8">
          
          <Breadcrumbs property={property} lang={lang} />

          <ImageGalleryGrid images={property.images} openImageSlider={() => setIsModalOpen(true)} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12 mt-8">
            {/* --- Left Column: Property Info --- */}
            <div className="lg:col-span-2">
              <PropertyInfo property={property} />
            </div>

            {/* --- Right Column: Contact Card --- */}
            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <CallInfo property={property} />
            </div>
          </div>

          {/* --- SIMILAR PROPERTIES SECTION --- */}
          <section className="mt-20 pt-10 border-t border-stone-200">
            <div className="text-center mb-10">
              <p className="text-base font-semibold text-sky-600 arabic-bold">
                {lang === "en" ? "Discover" : "اسـتكـشف"}
              </p>
              <h2 className="text-4xl font-bold text-stone-800 arabic-bold mt-1">
                {lang === "en" ? "Similar Properties" : "عقارات مشابهة"}
              </h2>
            </div>
            
            {similarProperties.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : similarProperties.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {similarProperties.data.map((p) => (
                  <PropertyCard key={p.id} property={p} collection={p.collection} />
                ))}
              </div>
            ) : (
              <p className="w-full text-center my-10 text-stone-500">
                {lang === 'en' ? 'No Similar Properties Found' : 'لم يتم العثور على عقارات مشابهة'}
              </p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

// React Router loader function
export async function loader({ params }) {
  try {
    const property = await getDocumentData(params.collection, params.id);
    return property || null;
  } catch (error) {
    console.error("Loader failed to fetch document:", error);
    return null;
  }
}