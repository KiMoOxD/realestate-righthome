import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";

// let imgs = [
//   "https://images.unsplash.com/photo-1633183921767-2e0c740bada2?q=80&w=2004&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1690987601363-83022d125159?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1501876725168-00c445821c9e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1527772482340-7895c3f2b3f7?q=80&w=2151&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// ];

export default function ImageSlider({imgs, modal, setModal}) {
  let [isLoading, setIsLoading] = useState(true);
  let [index, setIndex] = useState(0)
  let [ActiveImg, setActiveImg] = useState(imgs[index])
  console.log(ActiveImg, index)

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
        <div className={`absolute w-full h-[100dvh] flex items-center justify-center left-0 z-50`} style={{top: `${window.scrollY}px`}}>
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
            className="relative flex max-w-[450px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1000px] max-h-[800px]"
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