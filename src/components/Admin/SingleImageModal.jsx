import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

export default function SingleImageModal({ img, altText = "Full-screen property image", singleModal, setSingleModal }) {

  // --- Effect for handling body scroll lock ---
  useEffect(() => {
    if (singleModal) {
      document.body.style.overflow = "hidden";
    }
    // Cleanup function to restore scroll when component unmounts or modal closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [singleModal]);

  // --- Effect for handling 'Escape' key press ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSingleModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSingleModal]);

  // We return null if the modal is not open, AnimatePresence handles the exit
  if (!singleModal) {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        // Accessibility attributes for a modal dialog
        role="dialog"
        aria-modal="true"
        // Use position:fixed for a true overlay that doesn't depend on scroll position
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* --- Backdrop with Blur --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSingleModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* --- Close Button --- */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => setSingleModal(false)}
          aria-label="Close image view" // Accessibility label
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors cursor-pointer"
        >
          <IoMdClose size={30} />
        </motion.button>

        {/* --- Image Container --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          // A spring transition feels more natural
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-full max-h-full"
        >
          <img
            src={img}
            alt={altText}
            className="block max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}