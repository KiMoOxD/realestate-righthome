import { Link, useLoaderData } from "react-router-dom";
import { getDocumentData } from "../utils/data";
import { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import ImagesList from "../components/PropertyPage/ImagesList";
import MainImage from "../components/PropertyPage/MainImage";
import PropertyInfo from "../components/PropertyPage/PropertyInfo";

export default function PropertyPage() {
  let property = useLoaderData();
  let [imgCont, setImgCont] = useState(property.images[0]);
  let [modal, setModal] = useState(false);

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  useEffect(() => {
    return () => document.body.style.overflow = "auto";
  }, [])

  return (
    <div className="min-h-[100vh] flex flex-col max-w-screen-xl mx-auto pt-10">
    <ImageSlider imgs={property.images} modal={modal} setModal={setModal} imgIdx={property.images.indexOf(imgCont)}/>
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
        <ImagesList images={property.images} imgCont={imgCont} setImgCont={setImgCont}/>
        <MainImage imgCont={imgCont} title={property.title} OpenModal={OpenModal}/>
        <PropertyInfo property={property} />
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
