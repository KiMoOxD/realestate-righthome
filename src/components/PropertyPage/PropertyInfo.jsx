import { useAllContext } from "../../context/AllContext";

export default function PropertyInfo({ property }) {
  let { lang } = useAllContext() 
  return (
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
  );
}
