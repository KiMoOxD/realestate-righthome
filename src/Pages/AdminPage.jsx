import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { FiMail, FiLock, FiLoader } from "react-icons/fi";

import PropertiesTable from "../components/Admin/PropertiesTable";
import ArchivedTable from "../components/Admin/ArchivedTable";
import UsersTable from "../components/Admin/UsersTable"; // Import the new UsersTable
import CreateForm from "../components/Admin/CreateForm";
import EditForm from "../components/Admin/EditForm";
import SingleImageModal from "../components/Admin/SingleImageModal";
import logo from '../images/RIGHT_HOME.png';
import { useAllContext } from "../context/AllContext";

// Toast component (unchanged)
const Toast = ({ message, status, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = status === true;
  const Icon = isSuccess ? HiOutlineCheckCircle : HiExclamationCircle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm p-4 rounded-xl shadow-2xl text-white ${isSuccess ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="text-3xl flex-shrink-0" />
        <div className="flex-grow">
          <p className="font-bold text-lg">{isSuccess ? 'Success!' : 'Error!'}</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
        <motion.div
          className={`h-1 ${isSuccess ? 'bg-emerald-200' : 'bg-rose-200'}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 3.8, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

// FloatingShape component (unchanged)
const FloatingShape = ({ className, ...props }) => (
    <motion.div
        className={`absolute rounded-full bg-white/10 filter blur-xl ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        {...props}
    />
);


export default function AdminPage() {
  const { login, currentUser, resetPassword } = useAllContext();
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [singleModal, setSingleModal] = useState(false);
  const [singleImage, setSingleImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [toast, setToast] = useState({ show: false, content: '', status: true });
  
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passRef = useRef();

  // State to manage the current view ('published', 'archived', or 'users')
  const [view, setView] = useState('published');

  useEffect(() => {
    if (currentUser) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  const triggerToast = (content, status = true) => {
    setToast({ show: true, content, status });
  };

  function CloseModal() {
    setModal(false);
    document.body.style.overflow = "auto";
  }
  function CloseEditModal() {
    setEditModal(false);
    document.body.style.overflow = "auto";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;
    if (!email || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setLoginError('');
    try {
      await login(email, password);
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPass() {
    const email = emailRef.current.value;
    if (!email) {
      setLoginError('Please enter your email address to reset the password.');
      return;
    }
    if (email !== 'righthome202@gmail.com') {
      setLoginError('Password reset is only available for the admin email.');
      return;
    }
    setLoading(true);
    setLoginError('');
    try {
      await resetPassword(email);
      triggerToast('Password reset link sent successfully!');
    } catch (error) {
      setLoginError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {toast.show && (
          <Toast
            message={toast.content}
            status={toast.status}
            onDismiss={() => setToast({ ...toast, show: false })}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div >
          {isAdmin ? (
            <div className="min-h-screen">
               {/* View switching UI */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => setView('published')}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      view === 'published'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    onClick={() => setView('archived')}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      view === 'archived'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Archived
                  </button>
                  {/* New button for Users view */}
                  <button
                    onClick={() => setView('users')}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      view === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Users
                  </button>
                </div>
              </div>

              {/* Conditional rendering of tables */}
              <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {view === 'published' ? <PropertiesTable setModal={setModal} setEditModal={setEditModal} />
                    : view === 'archived' ? <ArchivedTable setEditModal={setEditModal} />
                    : <UsersTable />}
                </motion.div>
              </AnimatePresence>

              {modal && (
                <CreateForm
                  CloseModal={CloseModal}
                  setSingleImage={setSingleImage}
                  setSingleModal={setSingleModal}
                  triggerToast={triggerToast}
                />
              )}
              {editModal && (
                <EditForm
                  isArchived={view === 'archived'}
                  CloseEditModal={CloseEditModal}
                  setSingleImage={setSingleImage}
                  setSingleModal={setSingleModal}
                  triggerToast={triggerToast}
                />
              )}
              {singleModal && (
                <SingleImageModal
                  img={singleImage}
                  singleModal={singleModal}
                  setSingleModal={setSingleModal}
                />
              )}
            </div>
          ) : (
            <div className="min-h-screen grid md:grid-cols-2">
              <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden">
                  <FloatingShape className="w-64 h-64 top-20 left-10" />
                  <FloatingShape className="w-48 h-48 bottom-10 right-20" transition={{ duration: 12 }} />
                  <FloatingShape className="w-24 h-24 bottom-40 left-32" transition={{ duration: 18 }} />
                  <div className="relative z-10 text-center text-white px-10">
                    <img src={logo} alt="Right Home Logo" className="w-40 mx-auto mb-4 invert brightness-0" />
                    <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-indigo-200">Admin dashboard for Right Home.</p>
                  </div>
              </div>

              <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-full max-w-sm"
                >
                  <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 shadow-2xl rounded-2xl">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Admin Login</h2>
                    
                    <div className="mb-4 relative">
                      <FiMail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                      <input id="email" ref={emailRef} placeholder="Email" className="py-3 px-12 w-full text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" type="email" />
                    </div>

                    <div className="mb-6 relative">
                      <FiLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                      <input id="password" ref={passRef} placeholder="Password" className="py-3 px-12 w-full text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" type="password" />
                    </div>
                    
                    {loginError && <p className="text-red-500 text-sm text-center mb-4">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white mt-2 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50"
                    >
                      {loading ? <FiLoader className="animate-spin" /> : "Login"}
                    </button>
                    
                    <p onClick={handleResetPass} className="text-center text-sm mt-6 text-blue-600 hover:underline cursor-pointer">
                      Forgot Password?
                    </p>
                  </form>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}