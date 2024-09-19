import { useEffect, useState } from "react";
import { deleteFromCollection, getAllCollectionsData } from "../../utils/data";
import { useAllContext } from "../../context/AllContext";

export default function PropertiesTable({setModal, setEditModal}) {
  let [propertiesData, setPropertiesData] = useState(null);
  let [data, setData] = useState(propertiesData);
  let {selectedProp, setSelectedProp} = useAllContext()
  console.log(selectedProp);
  useEffect(() => {
    async function getData() {
      let properties = await getAllCollectionsData();
      setPropertiesData(properties);
      console.log(properties);
      setData(properties);
    }
    getData();
  }, []);

  function handleSearch(e) {
    console.log("Content: ", e.target.value);
    let SearchResult = data.filter(
      (prop) =>
        prop.title.en.toLowerCase().includes(e.target.value.toLowerCase()) ||
        prop.description.en.toLowerCase().includes(e.target.value.toLowerCase()) ||
        prop.governate.en.toLowerCase().includes(e.target.value.toLowerCase()) ||
        prop.id.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setPropertiesData(SearchResult);
  }

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  function deleteProperty(collectionName, id) {
    setPropertiesData(prev => prev.filter(prop => prop.id !== id))
    setData(prev => prev.filter(prop => prop.id !== id))
    deleteFromCollection(collectionName, id)
  }

  

  return (
    <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg mx-auto pt-2 min-h-[600px]">
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
            placeholder="Search by Title/Governate/Description/id"
            onChange={handleSearch}
          />
        </div>
        <button onClick={OpenModal} className="mr-5 mt-2 lg:mt-0 bg-blue-500 text-center text-xs h-fit py-2 px-3 rounded text-white">Create New</button>
      </div>
      {!propertiesData && (
        <div
          role="status"
          class="w-full p-4 space-y-4  border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse  md:p-6 "
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
              <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      )}
      {propertiesData && (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Governate
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {propertiesData.map((prop) => {
              return (
                <tr
                  key={prop.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th className="px-6 py-4">{prop.id}</th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {prop.title.en}
                  </th>
                  <td className="px-6 py-4">{prop.governate.en}</td>
                  <td className="px-6 py-4">{prop.category}</td>
                  <td className="px-6 py-4">${prop.price}</td>
                  <td className="flex gap-5 px-6 py-4 cursor-pointer">
                    <div
                      className="font-medium text-blue-500 hover:underline"
                      onClick={() =>{
                        console.log('clicked')
                        setEditModal(true)
                        setSelectedProp({id: prop.id, cName: prop.category})
                      }}
                    >
                      Edit
                    </div>
                    <button
                      href="#"
                      className="font-medium text-red-500 hover:underline"
                      onClick={() =>
                        deleteProperty(`${prop.category}s`, prop.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
