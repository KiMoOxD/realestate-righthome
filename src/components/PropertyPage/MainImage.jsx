import { FaYoutube, FaImages } from "react-icons/fa";
import PropertyInfo from "../../components/PropertyPage/PropertyInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function MainImage({ imgCont, title, OpenModal, youtubeLinks, property }) {
  return (
    <div className="flex flex-col w-full lg:w-fit">
      <div className="relative group lg:self-start flex flex-grow justify-center overflow-hidden items-center max-w-full w-full min-h-[300px] max-h-[300px] md:max-h-[450px] lg:max-h-[500px] md:w-[100%] lg:max-w-[800px] xl:max-w-[900px] h-fit shadow-lg rounded-2xl border border-gray-200/50">
        <LazyLoadImage
          className="min-h-full max-h-full w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imgCont}
          alt={title.en}
          effect="blur"
          width={'100%'}
          height={'100%'}
        />
        <div
          onClick={OpenModal}
          className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex flex-col gap-2 items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-full">
            <FaImages className="text-white text-3xl" />
          </div>
          <p className="text-white text-lg font-semibold tracking-wider">View Gallery</p>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {youtubeLinks.map((link, index) => (
            <a key={index} href={link} rel="noreferrer" target="_blank" className="transform transition-transform hover:scale-110">
              <FaYoutube className="text-4xl text-red-600 bg-white rounded-full p-1 shadow-lg" />
            </a>
          ))}
        </div>
      </div>
      <PropertyInfo property={property} />
    </div>
  );
}