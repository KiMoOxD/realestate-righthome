// src/components/PropertyPage/ImageGalleryGrid.jsx

import { motion } from 'framer-motion';
import { HiPhoto } from 'react-icons/hi2';

export default function ImageGalleryGrid({ images, openImageSlider }) {
  // Use the first 5 images for the grid, or fewer if not available
  const displayImages = images.slice(0, 5);
  const remainingImages = images.length - 5;

  return (
    <motion.div 
      className="relative w-full h-[300px] md:h-[550px] overflow-hidden rounded-2xl cursor-pointer group"
      onClick={openImageSlider}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Grid container */}
      <div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-2">
        {/* Main Image */}
        <div className="col-span-4 md:col-span-2 row-span-2 overflow-hidden">
          <img
            src={displayImages[0]}
            alt="Main property view"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Other 4 Images */}
        {displayImages.slice(1).map((src, index) => (
          <div key={index} className="hidden md:block col-span-1 row-span-1 overflow-hidden">
            <img
              src={src}
              alt={`Property view ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* "Show all photos" button */}
      <div className="absolute bottom-5 right-5">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-stone-800 text-sm font-semibold rounded-lg shadow-lg hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent grid click from firing too
            openImageSlider();
          }}
        >
          <HiPhoto />
          Show all photos {remainingImages > 0 && `(+${remainingImages})`}
        </button>
      </div>
    </motion.div>
  );
}