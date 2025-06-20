import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArchivedCollectionData, deleteFromCollection } from "../../utils/data";
import { useAllContext } from "../../context/AllContext";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import DeleteIcon from "./deleteIcon"; // Re-using delete icon for consistency

export default function ArchivedTable({ setEditModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { setSelectedProp } = useAllContext();
  const queryClient = useQueryClient();

  // Fetch data from the 'archived' collection
  const { data: archivedProperties, isLoading } = useQuery({
    queryKey: ["archivedProperties"],
    queryFn: getArchivedCollectionData,
  });

  // Mutation to permanently delete a document from the 'archived' collection
  const deleteArchivedMutation = useMutation({
    mutationFn: (id) => deleteFromCollection("archived", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["archivedProperties"]);
      // You can add a success toast here if you like
    },
    onError: (error) => {
        console.error("Failed to delete archived property:", error);
    }
  });

  // Memoized search filtering
  const filteredProperties = useMemo(() => {
    if (!archivedProperties) return [];
    if (!searchTerm) return archivedProperties;
    return archivedProperties.filter(
      (prop) =>
        prop.title?.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prop.propertyCode && prop.propertyCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [archivedProperties, searchTerm]);

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Archived Properties</h1>
            <div className="relative flex-grow sm:flex-grow-0">
                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    className="block py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-64 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Search archived..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
            </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <AnimatePresence>
          {filteredProperties.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((prop) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={prop.id}
                  className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        // Set context with the ARCHIVED doc id and its category
                        // This info will be used by EditForm to publish it
                        setSelectedProp({ id: prop.id, cName: prop.category });
                        setEditModal(true);
                        document.body.style.overflow = "hidden";
                      }}
                      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-2 rounded-full text-green-600 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                      title="Edit & Publish"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <DeleteIcon
                      deleteProperty={() => deleteArchivedMutation.mutate(prop.id)}
                      prop={prop}
                      customIcon={<FiTrash2 className="w-4 h-4" />}
                      tooltip="Delete Permanently"
                    />
                  </div>

                  <div className="w-full h-48 cursor-pointer bg-gray-200">
                    <img
                      src={prop.preview ? prop.images[prop.preview] : prop.images[0]}
                      alt={prop.title?.en}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4">
                    <span className="text-xs font-semibold bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">{prop.category}</span>
                    <h3 className="mt-2 text-md font-bold text-gray-900 dark:text-white truncate" title={prop.title?.en}>
                      {prop.title?.en}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{prop.region?.en}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 col-span-full">
                <p className="text-gray-500 dark:text-gray-400">No archived properties found.</p>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
