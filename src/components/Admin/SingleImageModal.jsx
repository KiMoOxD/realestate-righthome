import React from "react";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";


export default function SingleImageModal({img, singleModal, setSingleModal}) {

  function CloseModal() {
    setSingleModal(false);
    document.body.style.overflow = "auto";
  }

  return (
    <>
      {singleModal && (
        <div className={`absolute w-full h-[calc(100vh-56px)] flex items-center justify-center left-0 z-20`} style={{top: `${window.scrollY}px`}}>
          <div
            onClick={CloseModal}
            className="absolute w-full h-full bg-black/80"
          ></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{type: 'tween'}}
            className="relative flex max-w-[450px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1000px] max-h-[80%] sm:max-h-[85%]"
          >
            <img
              src={img}
              alt=""
              className="max-h-full max-w-full w-fit object-contain"
            />
          </motion.div>
          <span
            onClick={CloseModal}
            className="absolute top-8 left-[10%] xl:left-[20%] text-3xl text-stone-50 rounded-full cursor-pointer"
          >
            <IoMdClose />
          </span>
        </div>
      )}
    </>
  );
}

//absolute w-full h-[100vh] top-0 left-0 flex items-center justify-evenly
