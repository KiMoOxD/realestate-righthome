import PropertiesTable from '../components/Admin/PropertiesTable'
import CreateForm from '../components/Admin/CreateForm';
import { useState } from 'react';

export default function AdminPage() {

  let [modal, setModal] = useState(false);
  function CloseModal() {
    setModal(false);
    document.body.style.overflow = "auto";
  }

  return (
    <div className='min-h-[calc(100vh-114px)] flex justify-center items-center max-w-screen-xl mx-auto p-2'>
      <PropertiesTable setModal={setModal} />
      {modal && <CreateForm CloseModal={CloseModal}/>}
    </div>
  )
}
