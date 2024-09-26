import { motion } from "framer-motion";

export default function MainImage({ imgCont, title, OpenModal}) {
  return (
    <motion.div initial={{opacity: 0, y: -30}} animate={{opacity: 1, y: 0}} className="relative lg:self-start flex flex-grow justify-center overflow-hidden items-center max-w-full w-full min-h-[300px] max-h-[300px] md:max-h-[450px] lg:max-h-[450px] md:w-[100%] lg:max-w-[700px] xl:max-w-[750px] h-fit shadow-[inset_0px_0px_9px_rgba(0,0,0,0.1)] border border-[#cccccc47] rounded-lg ">
      <img
        className=" min-w-full max-w-full min-h-full max-h-full transition brightness-50"
        src={imgCont}
        alt={title.en}
      />
      <div
        onClick={OpenModal}
        className="absolute h-full w-full flex items-center justify-center cursor-pointer"
      >
        <button className="text-blue-600 bg-slate-50/90 transition px-4 py-1 text-sm rounded">
          Click to View
        </button>
      </div>
    </motion.div>
  );
}
