import { useEffect, useState, useMemo } from "react";
import { deleteFromCollection, getAllCollectionsData, archiveDocument } from "../../utils/data";
import { useAllContext } from "../../context/AllContext";
import { FiEdit, FiSearch, FiPlus, FiLogOut, FiArchive, FiAlertTriangle } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageSlider from "../ImageSlider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


// ===================================================================================
// 1. Delete Confirmation Modal Component (defined in the same file)
// ===================================================================================
const DeleteConfirmation = ({ isOpen, onClose, onConfirm, propertyName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
              <FiAlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Delete Property?
            </h3>
            
            {/* Message */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to permanently delete the property: <br />
              <strong className="font-semibold text-gray-800 dark:text-gray-100">{propertyName}</strong>?
              <br /><br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex w-full gap-4 mt-8">
              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center justify-center w-full gap-2 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <HiOutlineTrash />
                Yes, Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


// ===================================================================================
// 2. Main PropertiesTable Component
// ===================================================================================
export default function PropertiesTable({ setModal, setEditModal }) {
  const [propertiesData, setPropertiesData] = useState(null);
  const [images, setImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const { setSelectedProp, logout } = useAllContext();
  const queryClient = useQueryClient();
  const [totalSize, setTotalSize] = useState(0);

  // UPDATED: State now holds the entire property object for deletion to provide more context to the modal.
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['propertiesTable'],
    queryFn: getAllCollectionsData,
  });

  const sortedProperties = useMemo(() => {
    if (!properties) return null;
    return [...properties].sort((a, b) => a.id.localeCompare(b.id));
  }, [properties]);

  useEffect(() => {
    if (sortedProperties) {
      let total = 0;
      sortedProperties.forEach((doc) => {
        const docSize = JSON.stringify(doc).length;
        total += docSize;
      });
      setTotalSize(total / (1024 * 1024));
      setPropertiesData(sortedProperties);
    }
  }, [sortedProperties]);

  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      setPropertiesData(sortedProperties);
      return;
    }
    let searchResult = sortedProperties.filter(
      (prop) =>
        prop.title.en.toLowerCase().includes(searchTerm) ||
        prop.category.toLowerCase().includes(searchTerm) ||
        prop.description.en.toLowerCase().includes(searchTerm) ||
        prop.region?.en.toLowerCase().includes(searchTerm) ||
        prop.id.toLowerCase().includes(searchTerm) ||
        (prop.propertyCode && prop.propertyCode.toLowerCase().includes(searchTerm))
    );
    setPropertiesData(searchResult);
  }

  function OpenModal() {
    setModal(true);
    document.body.style.overflow = "hidden";
  }

  const deletePropertyMutation = useMutation({
    mutationFn: ({ collectionName, id }) => deleteFromCollection(collectionName, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['propertiesTable']);
      setPropertyToDelete(null); // UPDATED: Close modal on success
    },
    onError: () => {
        setPropertyToDelete(null); // UPDATED: Close modal on error
    }
  });

  const archivePropertyMutation = useMutation({
    mutationFn: ({ collectionName, id }) => archiveDocument(collectionName, id),
    onSuccess: () => {
        queryClient.invalidateQueries(['propertiesTable']);
        queryClient.invalidateQueries(['archivedProperties']);
    },
    onError: (error) => {
        console.error("Failed to archive property:", error);
    }
  });

  // NEW: Handler to confirm and execute deletion via the modal
  const handleConfirmDelete = () => {
    if (propertyToDelete) {
        deletePropertyMutation.mutate({
            collectionName: `${propertyToDelete.category}s`,
            id: propertyToDelete.id,
        });
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  return (
    <> {/* UPDATED: Using a Fragment to wrap the page and the modal */}
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        {showImages && <ImageSlider imgs={images} modal={showImages} setModal={setShowImages} />}

        <header className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Published Properties</h1>
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            id="table-search"
                            className="block py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-64 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Search properties..."
                            onChange={handleSearch}
                            disabled={!sortedProperties}
                        />
                    </div>
                    <button
                        onClick={OpenModal}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <FiPlus />
                        <span className="hidden sm:inline">Create New</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center bg-red-500 text-white p-2.5 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <FiLogOut />
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Database Size: {totalSize.toFixed(2)}MB / 1GB</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(totalSize / 1024) * 100}%` }}></div>
                </div>
            </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                  {propertiesData && propertiesData.map((prop) => (
                      <motion.div
                          key={prop.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {/* Edit Button */}
                              <button
                                  onClick={() => {
                                      setEditModal(true);
                                      setSelectedProp({ id: prop.id, cName: prop.category });
                                      document.body.style.overflow = "hidden";
                                  }}
                                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                                  title="Edit"
                              >
                                  <FiEdit className="w-4 h-4"/>
                              </button>

                              {/* Archive Button */}
                              <button
                                  onClick={() => {
                                      archivePropertyMutation.mutate({ collectionName: `${prop.category}s`, id: prop.id });
                                  }}
                                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-2 rounded-full text-yellow-600 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                                  title="Archive"
                                  disabled={archivePropertyMutation.isLoading}
                              >
                                  {archivePropertyMutation.isLoading && archivePropertyMutation.variables?.id === prop.id ? (
                                      <svg className="animate-spin h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                  ) : (
                                      <FiArchive className="w-4 h-4"/>
                                  )}
                              </button>

                              {/* REMOVED: Old inline pop-up confirmation */}
                              {/* NEW: Delete button that triggers the modal */}
                              <button
                                  onClick={() => setPropertyToDelete(prop)}
                                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                                  title="Delete"
                              >
                                  <RiDeleteBin5Line className="w-4 h-4" />
                              </button>
                          </div>

                          <div className="w-full h-48 cursor-pointer" onClick={() => { setImages(prop.images); setShowImages(true); }}>
                              <img
                                  src={prop.preview ? prop.images[prop.preview] : prop.images[0]}
                                  alt={prop.title?.en}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                          </div>
                          
                          <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2.5 py-1 rounded-full">{prop.category}</span>
                                  <span className="text-xs text-gray-400 dark:text-gray-500">{prop.propertyCode || prop.id.substring(0,6)}</span>
                              </div>

                              <Link to={`/browse/${prop.category}s/${prop.id}`} className="block hover:underline">
                                  <h3 className="text-md font-bold text-gray-900 dark:text-white truncate" title={prop.title?.en}>
                                      {prop.title?.en}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{prop.region?.en}</p>
                              </Link>

                              <div className="mt-4">
                                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{new Intl.NumberFormat('en-US').format(prop.price)} <span className="text-sm font-normal text-gray-500">EGP</span></p>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </AnimatePresence>
          </div>
        )}
      </div>

      {/* 3. Render the modal component */}
      <DeleteConfirmation
        isOpen={!!propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleConfirmDelete}
        propertyName={propertyToDelete?.title?.en || 'this property'}
      />
    </>
  );
}