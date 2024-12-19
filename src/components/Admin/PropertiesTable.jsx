import { useEffect, useState } from "react";
import { deleteFromCollection, getAllCollectionsData } from "../../utils/data";
import { useAllContext } from "../../context/AllContext";
import { FiEdit } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageSlider from "../ImageSlider";
import DeleteIcon from "./deleteIcon";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function PropertiesTable({ setModal, setEditModal }) {
  let [propertiesData, setPropertiesData] = useState(null);
  let [data, setData] = useState(propertiesData);
  let [images, setImages] = useState([])
  let [showImages, setShowImages] = useState(false)
  let { setSelectedProp, logout } = useAllContext();
  let queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['propertiesTable'],
    queryFn: getAllCollectionsData, // Function to fetch data
  });

  useEffect(() => {
    setPropertiesData(properties);
    setData(properties);
  }, [properties])

  function handleSearch(e) {
    let SearchResult = data.filter(
      (prop) =>
        prop.title.en.toLowerCase().includes(e.target.value.toLowerCase()) ||
        prop.category.toLowerCase().includes(e.target.value.toLowerCase()) ||
        prop.description.en
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        prop.region?.en
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        prop.id.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setPropertiesData(SearchResult);
  }

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  const deletePropertyMutation = useMutation({
    mutationFn: ({ collectionName, id }) => deleteFromCollection(collectionName, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['propertiesTable']);
    },
  });

  function deleteProperty(collectionName, id) {
    deletePropertyMutation.mutate({ collectionName, id })
  }

  console.log('Sorting', propertiesData && propertiesData.sort((a, b) => a.price - b.price))


  return (
    <div className="w-full shadow-md sm:rounded-lg mx-auto my-2 p-2 min-h-[580px]">
      {showImages && <ImageSlider imgs={images} modal={showImages} setModal={setShowImages} />}
      <div className="pb-4 flex items-center justify-between flex-wrap px-2">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 outline-none max-w-full"
            placeholder="Search..."
            onChange={handleSearch}
            disabled={propertiesData === null}
          />
        </div>
        <div className="flex gap-1 items-center">
          <button
            onClick={OpenModal}
            className="mt-2 lg:mt-0 bg-blue-500 text-center text-xs h-fit py-2 px-3 rounded text-white"
          >
            Create New
          </button>
          <button
            onClick={logout}
            className="mt-2 lg:mt-0 bg-red-500 text-center text-xs h-fit py-2 px-3 rounded text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {isLoading && (
        <div
          role="status"
          className="w-full p-4 space-y-4  border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse  md:p-6 "
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <AnimatePresence mode="wait">
        {propertiesData && (
          <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-2 w-full">
            {propertiesData.sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0)).map((prop) => {
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  key={prop.id}
                  className="relative flex gap-2 items-center w-full bg-stone-100/80 p-2 md:p-4 rounded shadow"
                >
                  <FiEdit
                    className="absolute top-2 right-10 text-stone-500 cursor-pointer"
                    onClick={() => {
                      console.log("clicked");
                      setEditModal(true);
                      setSelectedProp({ id: prop.id, cName: prop.category });
                      document.body.style.overflow = "hidden";
                    }}
                  />
                  <DeleteIcon deleteProperty={deleteProperty} prop={prop} />
                  <img
                    src={prop.preview ? prop.images[prop.preview] : prop.images[0]}
                    alt=""
                    className="size-16 min-w-16 object-cover rounded cursor-pointer"
                    onClick={() => {setImages(prop.images); setShowImages(true)}}
                  />
                  <div className="w-full pr-2">
                    {/* <p className="text-xs text-stone-500/90">{prop.id}</p> */}
                    <Link to={`/browse/${prop.category}s/${prop.id}`} className="text-md font-medium flex items-center justify-between hover:underline mt-2">
                      <span className="truncate max-w-[160px] lg:max-w-[250px] xl:max-w-[190px] 2xl:max-w-[190px]">
                        {prop.title?.en}
                      </span>
                      <span className="text-xs truncate max-w-[100px] sm:max-w-[400px]">
                        {prop.region?.en}
                      </span>
                    </Link>
                    <p className="font-medium flex items-center justify-between">
                      <span className="truncate">{prop.price} EGP</span>
                      <span className="text-xs">{prop.category}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
