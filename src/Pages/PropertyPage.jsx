import { Link, useLoaderData, useParams } from "react-router-dom";
import { getCollectionData, getDocumentData } from "../utils/data";
import { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import MainImage from "../components/PropertyPage/MainImage";
import { useAllContext } from "../context/AllContext";
import SkeletonCard from "../components/SkeletonCard.jsx";
import PropertyCard from "../components/PropertyCard";
import CallInfo from "../components/PropertyPage/CallInfo.jsx";

export default function PropertyPage() {
  let property = useLoaderData(),
    params = useParams(),
    { lang } = useAllContext(),
    [imgCont, setImgCont] = useState(property ? property.images[0] : []),
    [modal, setModal] = useState(false),
    [properties, setProperties] = useState([]);

  useEffect(() => {
    async function getData() {
      if (property) {
        let propertiesData = await getCollectionData(params.collection);
        setProperties(
          propertiesData.filter((item) => item.id !== params.id).length === 0
            ? "empty"
            : propertiesData.filter((item) => item.id !== params.id)
        );
        setImgCont(property.images[0]);
      }
    }
    getData();
    return () => (document.body.style.overflow = "auto");
  }, [params.collection, params.id, property.images, property]);

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      {property === 0 ? (
        <div className="p-5 flex flex-col justify-center items-center min-h-[calc(100vh-114px)]">
          <p className="text-3xl mb-5">Looks Like The Page Doesn't exist...</p>
          <Link to={".."} className="text-sm">
            Back to{" "}
            <span className="rounded-lg px-4 py-2 bg-blue-500 text-white">
              Home
            </span>
          </Link>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-114px)] px-2">
          {" "}
          <div className="flex flex-col max-w-screen-2xl mx-auto">
            <ImageSlider
              imgs={property.images}
              modal={modal}
              setModal={setModal}
            />
            <div className="flex flex-col lg:flex-row items-start gap-6 px-1 2xl:px-0 mt-5">
              <MainImage
                imgCont={imgCont}
                title={property.title}
                OpenModal={OpenModal}
                youtubeLinks={property.youtubeLinks}
                property={property}
              />
              <CallInfo property={property} />
            </div>
            <p className="text-md font-semibold text-blue-600 arabic-bold mx-auto mt-10">
              {lang === "en" ? "Discover" : "اسـتكـشف"}
            </p>
            <p className="text-3xl font-semibold text-stone-800 arabic-bold mx-auto mt-1">
              {lang === "en" ? "Simillar Properties" : "عقارات مشابهة"}
            </p>
          </div>
          {properties === "empty" ? (
            <p className="w-full text-center my-10">No Simillar Properties</p>
          ) : (
            <div className="px-4 max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3 mx-auto my-7">
              {" "}
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
          )}
        </div>
      )}
    </>
  );
}

export async function loader({ params }) {
  let id = params.id;
  let collection = params.collection;
  let property = getDocumentData(collection, id);

  return property ? property : null;
}
