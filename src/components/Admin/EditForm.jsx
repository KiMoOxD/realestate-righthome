import { useState, useEffect } from "react";
import Select from "react-select";
import {
  regionOptionsEn,
  statusOptions,
  PaymentOptions,
  rentOptions,
  apartmentTypes,
} from "../../utils/data";
import { AnimatePresence, motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import { useAllContext } from "../../context/AllContext";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  handleUpload,
  fetchAndSetPropertyData,
  validateForm,
  buildPropertyData,
} from "../../utils/functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDocument, publishDocument } from "../../utils/data";
import { CiImageOn } from "react-icons/ci";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";


const initialFormData = {
  region: null,
  selectedImages: [],
  title: { en: "", ar: "" },
  description: { en: "", ar: "" },
  selectedStatus: "",
  selectedCategory: "",
  paymentType: PaymentOptions[0],
  youtubeLinks: [],
  propertyLocation: "",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  preview: 0
}

let insTypeOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Three Months (Quarterly)', value: 'quarterly ' },
]

let recieveDateOptions = [
  { label: 'Instant', value: 'instant' },
  { label: '1 Year', value: 1 },
  { label: '2 Years', value: 2 },
  { label: '3 Years', value: 3 },
  { label: '4 Years', value: 4 },
  { label: '5 Years', value: 5 },
]

// Self-contained notification component
const NotificationPopup = ({ type, message }) => {
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
    const icon = isSuccess ? <HiCheckCircle className="text-xl" /> : <HiExclamationCircle className="text-xl" />;

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
            className={`absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 w-auto max-w-md p-4 text-white ${bgColor} rounded-lg shadow-lg z-50`}
        >
            {icon}
            <p className="text-sm font-medium">{message}</p>
        </motion.div>
    );
};


export default function EditForm({
  CloseEditModal,
  setSingleImage,
  setSingleModal,
  isArchived, // NEW prop to determine form behavior
}) {

  const [language, setLanguage] = useState("en"),
    [formData, setFormData] = useState(initialFormData),
    [notification, setNotification] = useState({ show: false, type: '', message: '' }),
    [loading, setLoading] = useState(false),
    { selectedProp } = useAllContext();
  const queryClient = useQueryClient();

    // UPDATED: This useEffect now properly locks body scroll and fetches data
    useEffect(() => {
        // When the modal mounts, hide the scrollbar on the body.
        document.body.style.overflow = "hidden";

        const collection = isArchived ? 'archived' : `${selectedProp.cName}s`;
        fetchAndSetPropertyData(
          {...selectedProp, cName: collection}, 
          setFormData,
        );
        
        // When the modal unmounts, restore the scrollbar.
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedProp, isArchived]);
  
  const updatePropertyMutation = useMutation({
    mutationFn: ({ collectionName, docId, propertyData }) => updateDocument(collectionName, docId, propertyData),
    onSuccess: () => {
        queryClient.invalidateQueries(['propertiesTable']);
    },
  });

  // NEW: Mutation for publishing an archived property
  const publishPropertyMutation = useMutation({
    mutationFn: ({ archivedDocId, propertyData }) => publishDocument(archivedDocId, propertyData),
    onSuccess: () => {
        // Invalidate both lists on success
        queryClient.invalidateQueries(['propertiesTable']);
        queryClient.invalidateQueries(['archivedProperties']);
    }
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
    }, 2500);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm(formData)) {
      showNotification('error', "All fields marked with * must be filled out.");
      return;
    }

    setLoading(true);

    try {
      const propertyData = buildPropertyData(
        formData
      );
      
      if (isArchived) {
        // PUBLISH logic for archived items
        await publishPropertyMutation.mutateAsync({
            archivedDocId: selectedProp.id,
            propertyData
        });
        showNotification('success', 'Property Published Successfully.');
      } else {
        // UPDATE logic for active items
        await updatePropertyMutation.mutateAsync({
            collectionName: `${selectedProp.cName}s`,
            docId: selectedProp.id,
            propertyData
        });
        showNotification('success', 'Property Updated Successfully.');
      }

      setLoading(false);

      setTimeout(() => {
        CloseEditModal();
      }, 2000);

    } catch (error) {
      console.error("Error during submission:", error);
      setLoading(false);
      showNotification('error', `An error occurred: ${error.message}`);
    }
  }

  async function handleImageAdd(e) {
    const files = Array.from(e.target.files);
    const uploadedImageUrls = await handleUpload(files);
    updateFormData("selectedImages", [
      ...formData.selectedImages,
      ...uploadedImageUrls,
    ]);
  }

  return (
    // CHANGE: Switched to `position: fixed` to cover the viewport and lock scrolling.
    <div className="fixed inset-0 z-20 flex items-center justify-center p-5">
        <AnimatePresence>
            {notification.show && (
                <NotificationPopup type={notification.type} message={notification.message} />
            )}
        </AnimatePresence>

        <div
            onClick={CloseEditModal}
            className="absolute inset-0 bg-black/80"
        ></div>

        {/* CHANGE: Increased max-width to 6xl for the three-column layout */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                {isArchived ? "Edit & Publish Property" : "Edit Property"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-2">
                
                {/* CHANGE: Form content is now in a 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* First Column */}
                    <div className="flex flex-col gap-4">
                        {/* Image Upload */}
                         <div className="h-40 border rounded-md p-2 overflow-y-auto">
                           <div className="flex gap-2 flex-wrap">
                             {formData.selectedImages.map((img, idx) => (
                               <div key={img + idx} className="relative cursor-pointer border rounded-md hover:border-blue-600 transition">
                                 <img
                                   src={img}
                                   alt=""
                                   className="h-14 w-14 object-cover rounded-md"
                                   onClick={() => { setSingleImage(img); setSingleModal(true); }}
                                 />
                                 <IoMdCloseCircleOutline
                                   className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-red-600 text-lg bg-white rounded-full cursor-pointer"
                                   onClick={() => updateFormData('selectedImages', formData.selectedImages.filter((item) => item !== img))}
                                 />
                                 <CiImageOn onClick={() => updateFormData('preview', idx)} className={`absolute bottom-0.5 left-0.5 ${formData.preview === idx ? 'bg-blue-700 text-white' : 'text-blue-700 bg-white'} text-base rounded z-10`} />
                               </div>
                             ))}
                             <label htmlFor="dropzone-file" className="h-14 w-14 bg-stone-100 flex items-center justify-center border rounded-md hover:shadow cursor-pointer">
                               <span className="text-stone-400 text-2xl">+</span>
                               <input id="dropzone-file" onChange={handleImageAdd} type="file" className="hidden" multiple />
                             </label>
                           </div>
                         </div>
                        
                        {/* Basic Info */}
                         <div className="grid grid-cols-2 gap-4">
                           <Select options={regionOptionsEn} placeholder="Region*" onChange={(option) => updateFormData("region", option)} value={formData.region} required />
                           <Select options={PaymentOptions} placeholder="Payment*" onChange={(option) => updateFormData("paymentType", option)} value={formData.paymentType} required/>
                           <input onChange={(e) => updateFormData('price', e.target.value)} value={formData.price} className="p-2 border rounded-md text-sm" type="text" placeholder="Price" />
                           <input onChange={(e) => updateFormData('propertyCode', e.target.value)} value={formData.propertyCode} className="p-2 border rounded-md text-sm" type="text" placeholder="Property Code" />
                         </div>

                        {/* Conditional Payment Fields */}
                         {formData.paymentType?.value === 'cash' ? (
                           <div className="grid grid-cols-2 gap-4">
                             <Select options={statusOptions} placeholder="Status*" onChange={(option) => updateFormData("selectedStatus", option)} value={formData.selectedStatus} isDisabled={formData.paymentType?.value === "installment"} required={formData.paymentType?.value === 'cash'} />
                             <Select options={rentOptions} placeholder="Rent Type..." onChange={(option) => updateFormData("rentType", option)} value={formData.rentType} isDisabled={!formData.selectedStatus || formData.selectedStatus?.value === "sale"} />
                           </div>
                         ) : (
                           <div className="grid grid-cols-2 gap-4">
                             <input onChange={(e) => updateFormData("downPayment", e.target.value)} className="p-2 border rounded-md text-sm" type="number" value={formData.downPayment} placeholder="Down Payment" />
                             <input type="number" min={0} value={formData.insYears} onChange={(e) => updateFormData("insYears", e.target.value)} className="p-2 border rounded-md text-sm" placeholder="Installment Years" />
                             <input type="number" min={0} value={formData.monthlyPrice} onChange={(e) => updateFormData("monthlyPrice", e.target.value)} className="p-2 border rounded-md text-sm" placeholder="Monthly Price" />
                             <Select options={insTypeOptions} placeholder="Installment Type..." value={formData.insType} onChange={(option) => updateFormData('insType', option)} />
                             <Select options={recieveDateOptions} placeholder="Handover Date..." value={formData.recieveDate} onChange={(option) => updateFormData('recieveDate', option)} />
                           </div>
                         )}
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col gap-4">
                        {/* Category Display (Not editable, shown for context) */}
                         <div className="p-3 border rounded-md bg-gray-100 text-sm text-gray-700 w-full">
                           Category: <span className="font-semibold">{formData.selectedCategory?.charAt(0).toUpperCase() + formData.selectedCategory?.slice(1)}</span>
                         </div>

                        {/* Category Specific Fields */}
                         <AnimatePresence>
                           {formData.selectedCategory === 'villa' && (
                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-3 gap-2">
                               {['Standalone', 'Town house', 'Twin house'].map(villaType => (
                                 <div key={villaType} className="flex items-center ps-2 border rounded-md">
                                   <input onClick={(e) => updateFormData('villaType', e.target.value)} id={villaType} type="radio" value={villaType} name="villaType" className="text-blue-600" checked={formData.villaType === villaType} />
                                   <label htmlFor={villaType} className="w-full py-2 ms-2 text-sm">{villaType}</label>
                                 </div>
                               ))}
                             </motion.div>
                           )}
                           {formData.selectedCategory === 'apartment' && (
                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-2 gap-2">
                               <Select options={apartmentTypes} placeholder="Type..." onChange={(option) => updateFormData("apartmentType", option)} value={formData.apartmentType} />
                               <input type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} placeholder="Floor Number" className="ps-2 border rounded-md text-sm" />
                             </motion.div>
                           )}
                           {formData.selectedCategory === 'retail' && (
                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-3 gap-2">
                               {['Office', 'Clinic', 'Shop'].map(retailType => (
                                 <div key={retailType} className="flex items-center ps-2 border rounded-md">
                                   <input onChange={(e) => updateFormData('retailType', e.target.value)} id={retailType} type="radio" value={retailType} name="retailType" className="text-blue-600" checked={formData.retailType === retailType} />
                                   <label htmlFor={retailType} className="w-full py-2 ms-2 text-sm">{retailType}</label>
                                 </div>
                               ))}
                             </motion.div>
                           )}
                         </AnimatePresence>

                        <div className="grid grid-cols-3 gap-2">
                           <input value={formData.beds} onChange={(e) => updateFormData('beds', e.target.value)} type="number" placeholder="Beds" className="p-2 border rounded-md text-sm" />
                           <input value={formData.baths} onChange={(e) => updateFormData('baths', e.target.value)} type="number" placeholder="Baths" className="p-2 border rounded-md text-sm" />
                           <input value={formData.area} onChange={(e) => updateFormData('area', e.target.value)} type="number" placeholder="Area (m²)" className="p-2 border rounded-md text-sm" />
                         </div>

                        <input type="text" value={formData.developer} onChange={(e) => updateFormData("developer", e.target.value)} className="p-2 border rounded-md text-sm" placeholder="Developer" />
                         
                         <textarea
                             value={formData.propertyLocation}
                             onChange={(e) => updateFormData('propertyLocation', e.target.value)}
                             placeholder="Property Location (Google Maps Link or <iframe>)"
                             className="outline-none w-full p-2 rounded-md border text-sm h-24 resize-y"
                         />
                    </div>

                    {/* Third Column */}
                    <div className="flex flex-col gap-4">
                        <input type="text" value={formData.youtubeLinks} onChange={(e) => updateFormData('youtubeLinks', e.target.value.replace(/ /g, '').split(','))} placeholder="YouTube Links (comma-separated)" className="outline-none w-full p-2 rounded-md border text-sm" />
                         
                        <div>
                           <div className="flex gap-2 items-center mb-2">
                             <button type="button" onClick={() => setLanguage("en")} className={`py-1 px-3 text-xs rounded-full ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-stone-200'}`}>EN</button>
                             <button type="button" onClick={() => setLanguage("ar")} className={`py-1 px-3 text-xs rounded-full ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-stone-200'}`}>AR</button>
                           </div>
                           <div className="flex flex-col gap-2">
                             {language === "ar" ? (
                               <>
                                 <input value={formData.title?.ar} onChange={(e) => updateFormData("title", { ...formData.title, ar: e.target.value })} className="p-2 border rounded-md text-sm w-full" type="text" placeholder="العنوان" />
                                 <textarea value={formData.description?.ar} onChange={(e) => updateFormData("description", { ...formData.description, ar: e.target.value })} placeholder="الـوصـف" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                                 <textarea value={formData.about?.ar} onChange={(e) => updateFormData("about", { ...formData.about, ar: e.target.value })} placeholder="تفاصيل" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                               </>
                             ) : (
                               <>
                                 <input value={formData.title?.en} onChange={(e) => updateFormData("title", { ...formData.title, en: e.target.value })} className="p-2 border rounded-md text-sm w-full" type="text" placeholder="Title" />
                                 <textarea value={formData.description?.en} onChange={(e) => updateFormData("description", { ...formData.description, en: e.target.value })} placeholder="Description" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                                 <textarea value={formData.about?.en} onChange={(e) => updateFormData("about", { ...formData.about, en: e.target.value })} placeholder="About" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                               </>
                             )}
                           </div>
                         </div>
                    </div>
                </div>

                {/* Action Buttons with conditional text */}
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={CloseEditModal} type="button" className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 w-36 disabled:bg-blue-400" disabled={loading}>
                        {loading ? <CgSpinner className="animate-spin text-2xl mx-auto" /> : (isArchived ? "Save & Publish" : "Save Changes")}
                    </button>
                </div>
            </form>
        </motion.div>
    </div>
  );
}