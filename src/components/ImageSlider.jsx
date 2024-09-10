import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";


export default function ImageSlider({imgs, modal, setModal, imgIdx}) {
  let [isLoading, setIsLoading] = useState(true);
  let [index, setIndex] = useState(imgIdx)
  let [ActiveImg, setActiveImg] = useState(imgs[index])
  console.log(ActiveImg, index,imgIdx)

  useEffect(() => {
    setActiveImg(imgs[index])
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
        <div className={`absolute w-full h-[calc(100vh-50px)] flex items-center justify-center left-0 z-50`} style={{top: `${window.scrollY}px`}}>
          <div
            onClick={CloseModal}
            className="absolute w-full h-full bg-black/80"
          ></div>
          <span onClick={bkdToggle} className="absolute z-20 top-1/2 translate-y-[-50%] left-5 md:left-[10%] xl:left-[20%] text-4xl text-stone-100 bg-black/50 rounded-full pr-1.5 p-1 cursor-pointer">
            <IoIosArrowBack />
          </span>
          <span onClick={fwdToggle} className="absolute z-20 top-1/2 translate-y-[-50%] right-5 md:right-[10%] xl:right-[20%] text-4xl text-stone-100 bg-black/50 rounded-full pl-1.5 p-1 cursor-pointer">
            <IoIosArrowForward />
          </span>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{type: 'tween'}}
            className="relative flex max-w-[450px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1000px] max-h-[85%]"
          >
            {isLoading && <CgSpinner className="animate-spin text-5xl my-20 mx-auto"/>}
            <img
              src={ActiveImg}
              alt=""
              onLoad={() => setIsLoading(false)}
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
