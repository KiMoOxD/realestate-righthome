import PropertiesTable from "../components/Admin/PropertiesTable";
import CreateForm from "../components/Admin/CreateForm";
import { useState } from "react";
import EditForm from "../components/Admin/EditForm";
import SingleImageModal from "../components/Admin/SingleImageModal";
import { TextEffect } from "../components/TextEffect/TextEffectBase.tsx";
import { motion } from "framer-motion";

export default function AdminPage() {
  let [modal, setModal] = useState(false);
  let [editModal, setEditModal] = useState(false);
  let [singleModal, setSingleModal] = useState(false);
  let [singleImage, setSingleImage] = useState(null);
  let [isAdmin, setIsAdmin] = useState(true);
  let [magicWord, setMagicWord] = useState(false);

  function CloseModal() {
    setModal(false);
    document.body.style.overflow = "auto";
  }
  function CloseEditModal() {
    setEditModal(false);
    document.body.style.overflow = "auto";
  }

  function handleChange(e) {
    setMagicWord(e.target.value);
  }
console.log(process.env.REACT_APP_ADMIN_WORD)
  function handleClick() {
    console.log(magicWord === process.env.REACT_APP_ADMIN_WORD)
    if (magicWord === process.env.REACT_APP_ADMIN_WORD) {
      setIsAdmin(true);
    }
  }

  return (
    <>
      {isAdmin ? (
        <div className="min-h-[calc(100vh-114px)] flex flex-col justify-center items-center max-w-screen-2xl mx-auto p-2">
          <PropertiesTable setModal={setModal} setEditModal={setEditModal} />
          {modal && (
            <CreateForm
              CloseModal={CloseModal}
              setSingleImage={setSingleImage}
              setSingleModal={setSingleModal}
            />
          )}
          {editModal && (
            <EditForm
              CloseEditModal={CloseEditModal}
              setSingleImage={setSingleImage}
              setSingleModal={setSingleModal}
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
        <div className="min-h-[calc(100vh-114px)] flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2 }}
          >
            <TextEffect
              per="char"
              preset="fade"
              className="max-w-7xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-mono"
            >
              Hello, Captain of Right Home!
            </TextEffect>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.9 }}
            className="mt-5 lg:mt-10"
          >
            <TextEffect
              per="char"
              preset="fade"
              className="max-w-4xl text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-mono"
              delay={2}
            >
              What's the magic word ?
            </TextEffect>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-5"
          >
            <input
              type="text"
              className="w-[200px] h-[40px] px-2 border-2 rounded outline-none"
              placeholder="Magic word goes here..."
              onChange={handleChange}
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-5 bg-blue-500 px-4 py-1 rounded shadow-md transition hover:bg-blue-600 text-white"
            onClick={handleClick}
          >
            Lets go ?
          </motion.button>
        </div>
      )}
    </>
  );
}
