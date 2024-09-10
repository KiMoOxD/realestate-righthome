import { Link, useLoaderData, useParams } from "react-router-dom";
import { getCollectionData, getDocumentData } from "../utils/data";
import { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import ImagesList from "../components/PropertyPage/ImagesList";
import MainImage from "../components/PropertyPage/MainImage";
import PropertyInfo from "../components/PropertyPage/PropertyInfo";
import { useAllContext } from "../context/AllContext";
import SkeletonCard from "../components/SkeletonCard.jsx";
import PropertyCard from "../components/PropertyCard";

export default function PropertyPage() {
  let property = useLoaderData();
  let [imgCont, setImgCont] = useState(property.images[0]);
  let [modal, setModal] = useState(false);
  let { lang } = useAllContext();
  let params = useParams(),
    [properties, setProperties] = useState([]);

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  useEffect(() => {
    async function getData() {
      let propertiesData = await getCollectionData(params.collection);
      setProperties(propertiesData);
    }
    getData();
    return () => (document.body.style.overflow = "auto");
  }, [params.collection]);

  return (
    <>
      <div className="flex flex-col max-w-screen-xl mx-auto">
        <ImageSlider
          imgs={property.images}
          modal={modal}
          setModal={setModal}
          imgIdx={property.images.indexOf(imgCont)}
        />
        {property === 0 && (
          <div className="p-5 text-center">
            <p className="text-3xl mb-5">
              Looks Like The Page Doesn't exist...
            </p>
            <Link to={".."} className="text-sm">
              Back to{" "}
              <span className="rounded-lg px-4 py-2 bg-blue-500 text-white">
                Home
              </span>
            </Link>
          </div>
        )}
        <div className="flex flex-col lg:flex-row items-center gap-4 px-4 2xl:px-0 mt-5">
          <ImagesList
            images={property.images}
            imgCont={imgCont}
            setImgCont={setImgCont}
          />
          <MainImage
            imgCont={imgCont}
            title={property.title}
            OpenModal={OpenModal}
          />
          <PropertyInfo property={property} />
        </div>
        <p className="text-md font-semibold text-blue-600 arabic-bold mx-auto mt-5">
          {lang === "en" ? "Discover" : "اسـتكـشف"}
        </p>
        <p className="text-3xl font-semibold text-stone-800 arabic-bold mx-auto mt-1">
          {lang === "en" ? "Simillar Properties" : "عقارات مشابهة"}
        </p>
      </div>
      <div className="px-4 max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3 mx-auto my-7">
        {properties.length > 0 ? (
          properties.map((apartment) => (
            <PropertyCard key={apartment.id} property={apartment} />
          ))
        ) : (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
    </>
  );
}

export async function loader({ params }) {
  let id = params.id;
  let collection = params.collection;
  let property = getDocumentData(collection, id);
  console.log(property);

  return property ? property : null;
}
