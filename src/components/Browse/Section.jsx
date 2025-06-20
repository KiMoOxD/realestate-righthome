import { useAllContext } from "../../context/AllContext";
import PropertyCard from "../PropertyCard";
import SkeletonCard from "../SkeletonCard";

export default function Section({ title, subtitle, saleList, rentList }) {
  let { lang } = useAllContext();
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="text-center w-full">
        <p className="text-xl font-semibold text-blue-600 arabic-bold mx-auto mt-10">
          {lang === "en" ? title.en : title.ar}
        </p>
        <p className="text-3xl font-semibold text-stone-800 arabic-bold mx-auto mt-4">
          {lang === "en" ? subtitle.sale.en : subtitle.sale.ar}
        </p>
      </div>
      {saleList === 'empty' ? <p className="min-h-[150px] flex justify-center items-center w-full">{lang === 'en' ? 'No Properties here yet' : 'لا يوجد عقارات منشورة هنا بعد'}</p> : <div className="px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-3 mt-5">
        {saleList.length > 0 ? (
          saleList.map((prop) => {
            return <PropertyCard key={prop.id} property={prop} />;
          })
        ) : (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            {/* <SkeletonCard /> */}
          </>
        )}
      </div>}

      <div className="text-center w-full py-5">
        <p className="text-3xl font-semibold text-stone-800 arabic-bold mx-auto mt-5">
          {lang === "en" ? subtitle.rent.en : subtitle.rent.ar}
        </p>
      </div>
      {rentList === 'empty' ? <p className="min-h-[150px] flex justify-center items-center">{lang === 'en' ? 'No Properties here yet' : 'لا يوجد عقارات منشورة هنا بعد'}</p> : <div className="px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-3 mt-5">
        {rentList.length > 0 ? (
          rentList.map((prop) => {
            return <PropertyCard key={prop.id} property={prop} />;
          })
        ) : (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>}
    </div>
  );
}
