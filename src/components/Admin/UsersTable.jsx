import { useEffect, useState } from "react";
import { getCollectionData, deleteFromCollection } from "../../utils/data";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiLoader, FiUser, FiMail, FiPhone, FiHome, FiLink, FiAlertCircle, FiInbox, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

// A skeleton component for a polished loading state
const UserCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="space-y-3">
            <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-5/6 h-3 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
             <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
             <div className="w-1/3 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
    </div>
);


const UsersTable = () => {
  const [masterUserList, setMasterUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCardIds, setExpandedCardIds] = useState(new Set());


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersData = await getCollectionData("users");
        const sortedUsers = usersData.sort((a, b) => b.submittedAt.toDate() - a.submittedAt.toDate());
        setMasterUserList(sortedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user submissions.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchUsers();
  }, []);


  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = masterUserList.filter(user => {
      const nameMatch = user.name && user.name.toLowerCase().includes(lowercasedFilter);
      const emailMatch = user.email && user.email.toLowerCase().includes(lowercasedFilter);
      const phoneMatch = user.phone && user.phone.toLowerCase().includes(lowercasedFilter);
      const messageMatch = user.message && user.message.toLowerCase().includes(lowercasedFilter);
      return nameMatch || emailMatch || phoneMatch || messageMatch;
    });
    setFilteredUsers(filteredData);
  }, [searchTerm, masterUserList]);


  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this submission?")) {
      setDeletingId(userId);
      try {
        await deleteFromCollection("users", userId);
        setMasterUserList(prev => prev.filter(user => user.id !== userId));
      } catch (err) {
        alert("Failed to delete user entry. Please refresh and try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (timestamp) => {
    return timestamp?.toDate().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) ?? 'N/A';
  };

  const toggleMessageExpand = (userId) => {
    setExpandedCardIds(prevExpandedIds => {
      const newIds = new Set(prevExpandedIds);
      if (newIds.has(userId)) {
        newIds.delete(userId);
      } else {
        newIds.add(userId);
      }
      return newIds;
    });
  };
  
  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
            <FiAlertCircle className="w-16 h-16 text-red-400 mb-4"/>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Oops! Something went wrong.</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{error}</p>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">User Submissions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A list of all contact form submissions, sorted by most recent.
        </p>
        <div className="relative mt-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
                type="search"
                placeholder="Search by name, email, phone, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow shadow-sm"
            />
        </div>
      </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)}
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const isExpanded = expandedCardIds.has(user.id);
                        const isLongMessage = user.message && user.message.length > 150;

                        return (
                          <motion.div
                            key={user.id}
                            layout
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 flex flex-col transition-shadow hover:shadow-xl"
                          >
                            <div className="flex justify-between items-start p-5">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                         <FiUser className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                                    </div>
                                    <div className="truncate">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(user.submittedAt)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    disabled={deletingId === user.id}
                                    className="p-2 ml-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
                                    aria-label="Delete submission"
                                >
                                   {deletingId === user.id ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiTrash2 className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300">
                                {/* **FIXED**: Added `whitespace-pre-wrap` and `break-words` for proper text wrapping. */}
                                <blockquote className={`relative border-l-4 border-sky-400 dark:border-sky-500 pl-4 py-2 bg-slate-50 dark:bg-slate-900/40 rounded-r-lg transition-all duration-300 whitespace-pre-wrap break-words ${!isExpanded ? 'line-clamp-3' : ''}`}>
                                    {user.message}
                                </blockquote>
                                {isLongMessage && (
                                    <button 
                                        onClick={() => toggleMessageExpand(user.id)}
                                        className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold text-xs mt-2 hover:underline"
                                    >
                                        {isExpanded ? 'Show Less' : 'Show More'}
                                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>
                                )}
                            </div>

                            <div className="mt-auto p-5 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 rounded-b-2xl">
                                <div className="space-y-2 text-sm mb-4">
                                    <a href={`mailto:${user.email}`} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                        <FiMail className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{user.email}</span>
                                    </a>
                                    <a href={`tel:${user.phone}`} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                        <FiPhone className="w-4 h-4 flex-shrink-0" /> <span>{user.phone}</span>
                                    </a>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700/50 pt-4">
                                     <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                        <FiHome className="w-4 h-4 flex-shrink-0" />
                                        <span>Interested in: <strong>{user.property?.type}</strong> in <strong>{user.property?.location_en}</strong></span>
                                    </div>
                                    <a href={user.property?.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-xl hover:-translate-y-0.5">
                                        <FiLink className="w-4 h-4" />
                                        <span>View Property</span>
                                    </a>
                                </div>
                            </div>
                          </motion.div>
                        )
                    })
                ) : (
                     <motion.div 
                        key="no-results"
                        initial={{opacity: 0, scale: 0.95}} 
                        animate={{opacity: 1, scale: 1}}
                        className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center h-[40vh] text-center p-8"
                    >
                        <FiSearch className="w-20 h-20 text-slate-300 dark:text-slate-600 mb-4"/>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No Results Found</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Your search for "{searchTerm}" did not match any submissions.
                        </p>
                     </motion.div>
                )}
            </AnimatePresence>
          </div>
        )}
      
      {!loading && masterUserList.length === 0 && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
                <FiInbox className="w-20 h-20 text-slate-300 dark:text-slate-600 mb-4"/>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No Submissions Yet</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">When users submit the contact form, their messages will appear here.</p>
            </motion.div>
      )}
    </div>
  );
};

export default UsersTable;