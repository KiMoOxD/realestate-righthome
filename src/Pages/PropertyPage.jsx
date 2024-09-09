import { Link, useLoaderData } from "react-router-dom";
import { getDocumentData } from "../utils/data";
import { useState } from "react";
import ImageSlider from "../components/ImageSlider";
import { useAllContext } from "../context/AllContext";

export default function PropertyPage() {
  let property = useLoaderData();
  let [imgCont, setImgCont] = useState(property.images[0]);
  let [modal, setModal] = useState(false);
  let { lang } = useAllContext();

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  return (
    <div className="min-h-[90vh] flex flex-col max-w-screen-xl mx-auto pt-10">
      <ImageSlider imgs={property.images} modal={modal} setModal={setModal} />
      {property === 0 && (
        <div className="p-5 text-center">
          <p className="text-3xl mb-5">Looks Like The Page Doesn't exist...</p>
          <Link to={".."} className="text-sm">
            Back to{" "}
            <span className="rounded-lg px-4 py-2 bg-blue-500 text-white">
              Home
            </span>
          </Link>
        </div>
      )}
      <div className="flex flex-col lg:flex-row items-center gap-4 px-4 2xl:px-0 mt-5">
        <ul className="flex order-1 lg:order-none lg:flex-col gap-2 *:size-3 cursor-pointer overflow-scroll hide-scrollbar max-w-full">
          {property.images.map((image) => {
            return (
              <li
                key={image}
                onClick={() => setImgCont(image)}
                className={`border rounded-full relative overflow-hidden flex items-center justify-center hover:border-stone-950 hover:bg-stone-100 ${
                  imgCont === image ? "border-stone-950 bg-stone-100" : ""
                }`}
              >
                <span className="size-1.5 bg-black rounded-full"></span>
              </li>
            );
          })}
        </ul>

        <div className="relative lg:self-start flex flex-grow justify-center overflow-hidden items-center max-w-full w-full max-h-[300px] md:w-[75%] lg:w-[600px] xl:w-[650px] 2xl:w-[700px] lg:min-h-[350px] lg:max-h-[500px]">
          <img
            className="w-full lg:w-full max-h-full"
            src={imgCont}
            alt={property.title.en}
          />
          <div
            onClick={OpenModal}
            className="absolute h-full w-full bg-black/70 flex items-center justify-center cursor-pointer"
          >
            <button className="text-stone-300 hover:text-stone-00 bg-slate-50/10 hover:bg-slate-50/5 transition px-4 py-1">
              View full Images
            </button>
          </div>
        </div>
        <div className="max-w-[400px] w-full min-w-[300px] order-2 min-hh-[500px] flex flex-col">
          <p className="text-xs bg-stone-100 px-3 py-1 text-stone-700 w-fit">
            {property.status === "sale"
              ? lang === "en"
                ? "For Sale"
                : "للبيع"
              : lang === "en"
              ? "For Rent"
              : "للايجار"}
          </p>
          <h1 className="text-3xl mt-1.5">
            {lang === "en" ? property.title.en : property.title.ar}
          </h1>
          <div className="text-2xl  font-semibold">
            <p className="flex items-center">
              <span className="font-light text-[18px] pr-1">-50%</span>
              500
            </p>
            <p className="flex items-center font-normal text-sm mb-1">
              <span>List Price:</span>
              <span className="flex items-center text-gray-500 line-through">
                {property.price}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  let id = params.id;
  let collection = params.collection;
  let property = getDocumentData(collection, id);
  console.log(property);

  return property ? property : null;
}
