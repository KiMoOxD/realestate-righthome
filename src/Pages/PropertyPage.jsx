import { Link, useLoaderData } from "react-router-dom";
import { getDocumentData } from "../utils/data";
import { useState } from "react";

export default function PropertyPage() {
  let property = useLoaderData();
  let [imgCont, setImgCont] = useState(property.images[0])
  console.log(property);

  return (
    <div className="min-h-[90vh] flex flex-col max-w-screen-xl mx-auto mt-16">
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
        <ul className="flex order-1 lg:order-none lg:flex-col gap-2 *:size-16 lg:*:size-20 cursor-pointer">
        {property.images.map((image) => {
            return (
            <li
                key={image}
                onClick={() => setImgCont(image)}
                className={`border relative overflow-hidden flex items-center justify-center hover:border-stone-950 hover:bg-stone-100 ${
                imgCont === image ? "border-stone-950 bg-stone-100" : ""
                }`}
            >
                <img className="w-full h-full object-cover" src={image} alt="" />
            </li>
            );
        })}
        </ul>

    <div className="lg:self-start flex flex-grow justify-center overflow-hidden object-contain items-center max-w-full lg:w-[600px] xl:w-[650px] 2xl:w-[700px] min-h-[350px] lg:max-h-[500px]">
        <img
        className="w-[250px] md:w-[350px] lg:w-full max-h-full"
        src={imgCont}
        alt={property.title.en}
        />
    </div>
        <div className="max-w-[400px] w-full min-w-[300px] order-2 min-h-[500px] flex flex-col">
          <p className="text-xs bg-stone-800 px-1 py-0.5 text-white w-fit">
            Online App-Only Price
          </p>
          <h1 className="text-3xl mt-1.5">{property.title.en}</h1>
          <div className="text-2xl  font-semibold">
            <p className="flex items-center">
              <span className="font-light text-[18px] pr-1">
                -50%
              </span>
              {/* <BsCurrencyDollar className="text-sm self-start mt-1.5" /> */}
              500
            </p>
            <p className="flex items-center font-normal text-sm mb-1">
              <span>List Price:</span>
              <span className="flex items-center text-gray-500 line-through">
                {/* <BsCurrencyDollar className="text-xs" /> */}
                {property.price}
              </span>
            </p>
          </div>
          {/* <ProductInfo product={product} />
          <ProductCartButton product={product} />
          <ProductReviews product={product} /> */}
          sss
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
