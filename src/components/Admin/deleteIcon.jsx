import { RiDeleteBin5Line } from "react-icons/ri";
import { useState } from "react";

export default function DeleteIcon({deleteProperty, prop}) {
  let [showConfirm, setShowConfirm] = useState(false);
  function handleDelete() {
    setShowConfirm(true)
  }

  function handleDeleteDecision(prop, decision) {
    if (decision === 'yes') {
      deleteProperty(`${prop.category}s`, prop.id)
    }
    setShowConfirm(false)
  }
  return (
    <div>
      <RiDeleteBin5Line
        className=" top-1.5 right-3 text-lg text-stone-50 cursor-pointer size-5 drop-shadow-xl"
        onClick={() => handleDelete(prop)}
      />
      {showConfirm && (
        <div className="absolute top-7 border right-2 bg-white rounded p-2 w-fit">
          <p className="text-xs mb-2">Are you sure you want to delete?</p>
          <button
            className="text-xs mr-2 bg-blue-600 text-white p-1 rounded px-2"
            onClick={() => handleDeleteDecision(prop, "yes")}
          >
            Yes
          </button>
          <button
            className="text-xs mr-2 bg-red-600 text-white p-1 rounded px-2"
            onClick={() => handleDeleteDecision(prop, "no")}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
