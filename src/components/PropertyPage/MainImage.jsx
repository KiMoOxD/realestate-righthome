import { FaYoutube } from "react-icons/fa";
import PropertyInfo from "../../components/PropertyPage/PropertyInfo";


export default function MainImage({ imgCont, title, OpenModal, youtubeLinks, property}) {
  return (
    <div className="flex flex-col w-full lg:w-fit">
    <div className="relative lg:self-start flex flex-grow justify-center overflow-hidden items-center max-w-full w-full min-h-[300px] max-h-[300px] md:max-h-[450px] lg:max-h-[500px] md:w-[100%] lg:max-w-[800px] xl:max-w-[900px] h-fit shadow-[inset_0px_0px_9px_rgba(0,0,0,0.1)] border border-[#cccccc47] rounded-lg ">
      <img
        className=" min-w-full max-w-full min-h-full max-h-full transition brightness-50"
        src={imgCont}
        alt={title.en}
      />
      <div
        onClick={OpenModal}
        className="absolute h-full w-full flex flex-col gap-2 items-center justify-center cursor-pointer"
      >
        <button className="text-blue-600 bg-slate-50/90 transition px-4 py-1 text-sm rounded">
          Click to View Images
        </button>
      </div>
      <button className="absolute top-[55%] transition px-4 py-1 text-4xl flex gap-1 items-center">
          {youtubeLinks.map((link) => {
            return <a href={link} rel="noreferrer" target="_blank"><FaYoutube className="rounded-full bg-blue-700 text-white p-1.5 shadow z-50" /></a>
          })}
        </button>
    </div>
    <PropertyInfo property={property} />
  </div>
  );
}
