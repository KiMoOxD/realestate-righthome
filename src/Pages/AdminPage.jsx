import PropertiesTable from '../components/Admin/PropertiesTable'
import CreateForm from '../components/Admin/CreateForm';
import { useState } from 'react';
import EditForm from '../components/Admin/EditForm';
import SingleImageModal from '../components/Admin/SingleImageModal';

export default function AdminPage() {

  let [modal, setModal] = useState(false);
  let [editModal, setEditModal] = useState(false);
  let [singleModal, setSingleModal] = useState(false);
  let [singleImage, setSingleImage] = useState(null);
  function CloseModal() {
    setModal(false);
    document.body.style.overflow = "auto";
  }
  function CloseEditModal() {
    setEditModal(false);
    document.body.style.overflow = "auto";
  }
  console.log(singleImage)
  return (
    <div className='min-h-[calc(100vh-114px)] flex justify-center items-center max-w-screen-xl mx-auto p-2'>
      <PropertiesTable setModal={setModal} setEditModal={setEditModal} />
      {modal && <CreateForm CloseModal={CloseModal}/>}
      {editModal && <EditForm CloseEditModal={CloseEditModal} setSingleImage={setSingleImage} setSingleModal={setSingleModal} />}
      {singleModal && <SingleImageModal img={singleImage} singleModal={singleModal} setSingleModal={setSingleModal}/>}
    </div>
  )
}
