import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { TiCameraOutline } from "react-icons/ti";
import { CgSpinner } from "react-icons/cg";


export default function ImageSlider({imgs, modal, setModal}) {
  let [isLoading, setIsLoading] = useState(true);
  let [index, setIndex] = useState(0)
  let [ActiveImg, setActiveImg] = useState(imgs[index])

  useEffect(() => {
    setActiveImg(imgs[index])
    setIsLoading(true)
  }, [index, imgs])

  function CloseModal() {
    setModal(false);
    document.body.style.overflow = "auto";
  }

  function fwdToggle() {
    setIndex(prev => (prev+1) % imgs.length)
  }
  function bkdToggle() {
    setIndex(prev => prev === 0 ? (imgs.length-1) : prev-1)
  }

  return (
    <>
      {modal && (
        <div className={`absolute w-full h-[calc(100vh-56px)] flex items-center justify-center left-0 z-20`} style={{top: `${window.scrollY}px`}}>
          <div
            onClick={CloseModal}
            className="absolute w-full h-full bg-black/80"
          ></div>
          {imgs.length > 1 && <span onClick={bkdToggle} className="absolute z-20 top-1/2 translate-y-[-50%] left-5 md:left-[10%] xl:left-[20%] text-4xl text-blue-600 bg-white rounded-full pr-1.5 p-1 cursor-pointer">
            <IoIosArrowBack />
          </span>}
          {imgs.length > 1 && <span onClick={fwdToggle} className="absolute z-20 top-1/2 translate-y-[-50%] right-5 md:right-[10%] xl:right-[20%] text-4xl text-blue-600 bg-white rounded-full pl-1.5 p-1 cursor-pointer">
            <IoIosArrowForward />
          </span>}
          <span className="absolute top-8 right-[10%] 2xl:right-[25%] text-white flex gap-1.5 bg-black/50 px-2 py-1 rounded-lg text-sm"><span className="mt-1">{imgs.indexOf(ActiveImg)+1} / {imgs.length}</span> <TiCameraOutline className="text-2xl" /></span>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{type: 'tween'}}
            className="relative flex max-w-[450px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1000px] max-h-[80%] sm:max-h-[85%]"
          >
            {isLoading && <CgSpinner className="absolute top-1/2 left-1/2 animate-spin text-5xl text-blue-700"/>}
            <AnimatePresence mode="wait">
              <motion.img
                src={ActiveImg}
                key={ActiveImg}
                alt=""
                onLoad={() => setIsLoading(false)}
                className="max-h-full max-w-full w-fit object-contain"
                initial={{opacity: 0, x: 300}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -300}}
              />
            </AnimatePresence>
          </motion.div>
          <span
            onClick={CloseModal}
            className="absolute top-8 left-[10%] 2xl:left-[25%] text-3xl text-stone-50 rounded-full cursor-pointer"
          >
            <IoMdClose />
          </span>
        </div>
      )}
    </>
  );
}

//absolute w-full h-[100vh] top-0 left-0 flex items-center justify-evenly
