import { useAllContext } from "../context/AllContext";

export default function TypesList({ setCollectionType }) {
    let { lang } = useAllContext();

  return (
    <div className="flex flex-wrap justify-center px-4 gap-3 items-center my-5 *:transition text-sm">
      <button
        type="button"
        onClick={() => setCollectionType('all')}
        className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {lang === "en" ? "View All" : "الـكـل"}
      </button>
      <button
        type="button"
        onClick={() => setCollectionType('apartments')}
        className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {lang === "en" ? "Apartment" : "شـقـة"}
      </button>
      <button
        type="button"
        onClick={() => setCollectionType('villas')}
        className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {lang === "en" ? "Villa" : "فـيـلا"}
      </button>
      <button
        type="button"
        onClick={() => setCollectionType('studios')}
        className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {lang === "en" ? "Studio" : "ستوديو"}
      </button>
      <button
        type="button"
        onClick={() => setCollectionType('houses')}
        className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {lang === "en" ? "House" : "منزل"}
      </button>
      <button
        type="button"
        onClick={() => setCollectionType('offices')}
        className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {lang === "en" ? "Office" : "مكتب"}
      </button>
    </div>
  );
}
