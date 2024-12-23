import PropertiesTable from "../components/Admin/PropertiesTable";
import CreateForm from "../components/Admin/CreateForm";
import { useEffect, useRef, useState } from "react";
import EditForm from "../components/Admin/EditForm";
import SingleImageModal from "../components/Admin/SingleImageModal";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import logo from '../images/RIGHT_HOME.png'
import { useAllContext } from "../context/AllContext";




export default function AdminPage() {
  let {login, currentUser, resetPassword} = useAllContext();
  let [modal, setModal] = useState(false);
  let [editModal, setEditModal] = useState(false);
  let [singleModal, setSingleModal] = useState(false);
  let [singleImage, setSingleImage] = useState(null);
  let [isAdmin, setIsAdmin] = useState(false);
  let [confirmMsg, setConfirmMsg] = useState({show: false, status: true, content: ''})
  let [err, setErr] = useState({show: false, content: ''})
  let emailRef = useRef(),
      passRef = useRef();


  useEffect(() => {
    if (currentUser) {
      setIsAdmin(true)
    }
  }, [currentUser])

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
    if (emailRef.current.value === '' || passRef.current.value === '') {
      setErr({show: true, content: 'Please Fill in all Fields'})
      return;
    }
    await login(emailRef.current.value, passRef.current.value)
    if (currentUser) {
      setIsAdmin(true)
    } else {
      setErr({show: true, content: 'Email or Password is incorrect!'})
      return;
    }
  }

  async function handleResetPass() {
    if (emailRef.current.value === '') {
      setErr({show: true, content: 'Type in the email you want to reset'})
      return;
    } else if (emailRef.current.value !== 'righthome202@gmail.com') {
      setErr({show: true, content: 'The email must be the admin email...'});
      return;
    }
    resetPassword(emailRef.current.value)
    setErr({show: true, content: 'Reset Link was sent to yor email...'})
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
              setConfirmMsg={setConfirmMsg}
            />
          )}
          {editModal && (
            <EditForm
              CloseEditModal={CloseEditModal}
              setSingleImage={setSingleImage}
              setSingleModal={setSingleModal}
              setConfirmMsg={setConfirmMsg}
            />
          )}
          {singleModal && (
            <SingleImageModal
              img={singleImage}
              singleModal={singleModal}
              setSingleModal={setSingleModal}
            />
          )}
          {confirmMsg.show && <div className="absolute left-1/2 translate-x-[-50%] translate-y-[-50%] shadow border text-md text-stone-800 bg-white w-[300px] max-w-full" style={{top: `${window.innerHeight / 2}px`}}>
            <motion.div initial={{width: 0}} animate={{width: '100%'}} transition={{duration: 2}} className="h-1 bg-blue-600 w-full"></motion.div>
            <p className="py-3 px-4 flex flex-col gap-1 items-center">
              {!confirmMsg.status && <IoIosCloseCircleOutline className="text-2xl text-red-600"/>}
              {confirmMsg.status && <HiOutlineCheckCircle className="text-2xl text-green-600"/>}
              {confirmMsg.content}
              <button type="button" className="text-xs px-2 py-1 bg-blue-500 text-white" onClick={() => setConfirmMsg({show: false, status: true, content: ''})}>Ok</button>
              </p>
          </div>}
        </div>
      ) : (
        <div className="min-h-[calc(100vh-114px)] flex flex-col justify-center items-center">
          <form onSubmit={handleSubmit} className="pt-2 pb-10 px-10 shadow-md border w-[500px] max-w-full flex flex-col rounded-md">
            {err.show && <p className="w-full bg-blue-600 text-white py-1 px-2 text-xs rounded">{err.content}</p>}
            <img src={logo} alt="Right Home Logo" className="w-28 self-center"/>
            <label htmlFor="email" className="mb-1">Email</label>
            <input id="email" ref={emailRef} placeholder="example@example.com" className="p-2 outline-none self-center border w-full rounded" type="email" />
            <label htmlFor="password" className="my-1">Password</label>
            <input id="password" ref={passRef} placeholder="6$3hg2#$5dfh" className="p-2 outline-none self-center border w-full rounded" type="password" />
            <button className="w-fit mx-auto bg-blue-600 text-white mt-4 px-10 py-2">Login</button>
            <p onClick={handleResetPass} className="mx-auto text-sm mt-2 text-blue-700 hover:underline cursor-pointer">Forgot Password ?</p>
          </form>
        </div>
      )}
    </>
  );
}
