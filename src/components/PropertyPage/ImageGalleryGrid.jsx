// src/components/PropertyPage/ImageGalleryGrid.jsx

import { motion } from 'framer-motion';
import { HiPhoto } from 'react-icons/hi2';

// Animation variants for a more dynamic entrance
const galleryVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Animate children one by one
      duration: 0.3,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 30,
    },
  },
};

export default function ImageGalleryGrid({ images, openImageSlider }) {
  // We'll always display up to 5 image slots
  const displayImages = images.slice(0, 5);
  const remainingImagesCount = Math.max(0, images.length - 5);

  const ImageComponent = ({ src, alt, className }) => (
    <motion.div
      variants={imageVariants}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ zIndex: 10, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-90 hover:!brightness-100"
      />
    </motion.div>
  );

  return (
    <motion.div
      className="relative w-full h-[300px] md:h-[550px] overflow-hidden rounded-2xl cursor-pointer group"
      onClick={openImageSlider}
      variants={galleryVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Grid container */}
      <div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-2">
        {/* Main Image */}
        <ImageComponent
          src={displayImages[0]}
          alt="Main property view"
          className="col-span-4 md:col-span-2 row-span-2"
        />

        {/* Smaller Images */}
        {displayImages.slice(1, 4).map((src, index) => (
          <ImageComponent
            key={src}
            src={src}
            alt={`Property view ${index + 2}`}
            className="hidden md:block col-span-1 row-span-1"
          />
        ))}
        
        {/* Final Image Slot with "More Photos" overlay */}
        {displayImages.length > 4 && (
          <motion.div
            variants={imageVariants}
            className="hidden md:block relative col-span-1 row-span-1 overflow-hidden"
          >
            <img
              src={displayImages[4]}
              alt={`Property view 5`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
            />
            {remainingImagesCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-white text-2xl font-bold">
                  +{remainingImagesCount}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* "Show all photos" button with updated styling */}
      <div className="absolute bottom-5 right-5">
        <motion.button
          className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-black/60 hover:border-white/30 transition-all"
          onClick={(e) => {
            e.stopPropagation(); // Prevent grid click from firing
            openImageSlider();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiPhoto className="text-base" />
          Show all photos
        </motion.button>
      </div>
    </motion.div>
  );
}