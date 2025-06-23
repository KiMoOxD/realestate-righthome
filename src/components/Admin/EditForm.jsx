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


// NEW: A self-contained component for inputs with floating labels
const FloatingLabelInput = ({ label, value, onChange, type = 'text', as = 'input', ...props }) => {
    const InputComponent = as;
    return (
        <div className="relative">
            <InputComponent
                id={label}
                value={value}
                onChange={onChange}
                type={type}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " // Important: placeholder must not be empty
                {...props}
            />
            <label
                htmlFor={label}
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
                {label}
            </label>
        </div>
    );
};

// NEW: Helper for styling React-Select labels
const floatingSelectLabel = (hasValue) => 
    `absolute text-sm duration-300 transform z-10 origin-[0] bg-white px-2 start-1 pointer-events-none ${
        hasValue 
        ? 'text-blue-600 -translate-y-4 scale-75 top-2' 
        : 'text-gray-500 scale-100 -translate-y-1/2 top-1/2'
    }`;


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
    [isSaving, setIsSaving] = useState(false),
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
    },
  });

  const publishPropertyMutation = useMutation({
    mutationFn: ({ archivedDocId, propertyData }) => publishDocument(archivedDocId, propertyData),
    onSuccess: () => {
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
        await publishPropertyMutation.mutateAsync({
            archivedDocId: selectedProp.id,
            propertyData
        });
        showNotification('success', 'Property Published Successfully.');
      } else {
        await updatePropertyMutation.mutateAsync({
            collectionName: `${selectedProp.cName}s`,
            docId: selectedProp.id,
            propertyData
        });
        queryClient.invalidateQueries(['propertiesTable']);
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

  async function handleSaveOnly(e) {
      e.preventDefault();
      if(!validateForm(formData)) {
          showNotification('error', "All fields marked with * must be filled out.");
          return;
      }
      setIsSaving(true);
      try {
          const propertyData = buildPropertyData(formData);
          await updatePropertyMutation.mutateAsync({
              collectionName: 'archived',
              docId: selectedProp.id,
              propertyData
          });
          queryClient.invalidateQueries(['archivedProperties']);
          showNotification('success', 'Archived property saved.');
      } catch (error) {
          console.error("Error saving archived property:", error);
          showNotification('error', `An error occurred: ${error.message}`);
      } finally {
          setIsSaving(false);
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

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                {isArchived ? "Edit & Publish Property" : "Edit Property"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-2">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* First Column */}
                    <div className="flex flex-col gap-4">
                        {/* Image Upload */}
                         <div className="h-40 border rounded-md p-2 overflow-y-auto">
                           <div className="flex gap-2 flex-wrap">
                             {formData.selectedImages.map((img, idx) => (
                               <div key={img + idx} className="relative cursor-pointer border rounded-md hover:border-blue-600 transition">
                                 <img src={img} alt="" className="h-14 w-14 object-cover rounded-md" onClick={() => { setSingleImage(img); setSingleModal(true); }} />
                                 <IoMdCloseCircleOutline className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-red-600 text-lg bg-white rounded-full cursor-pointer" onClick={() => updateFormData('selectedImages', formData.selectedImages.filter((item) => item !== img))} />
                                 <CiImageOn onClick={() => updateFormData('preview', idx)} className={`absolute bottom-0.5 left-0.5 ${formData.preview === idx ? 'bg-blue-700 text-white' : 'text-blue-700 bg-white'} text-base rounded z-10`} />
                               </div>
                             ))}
                             <label htmlFor="dropzone-file" className="h-14 w-14 bg-stone-100 flex items-center justify-center border rounded-md hover:shadow cursor-pointer">
                               <span className="text-stone-400 text-2xl">+</span>
                               <input id="dropzone-file" onChange={handleImageAdd} type="file" className="hidden" multiple />
                             </label>
                           </div>
                         </div>
                        
                        {/* WRAPPER: Basic Info */}
                         <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className={floatingSelectLabel(formData.region)}>Region*</label>
                                <Select options={regionOptionsEn} onChange={(option) => updateFormData("region", option)} value={formData.region} required />
                            </div>
                            <div className="relative">
                                <label className={floatingSelectLabel(formData.paymentType)}>Payment*</label>
                                <Select options={PaymentOptions} onChange={(option) => updateFormData("paymentType", option)} value={formData.paymentType} required/>
                            </div>
                            <FloatingLabelInput label="Price" value={formData.price} onChange={(e) => updateFormData('price', e.target.value)} />
                            <FloatingLabelInput label="Property Code" value={formData.propertyCode} onChange={(e) => updateFormData('propertyCode', e.target.value)} />
                         </div>

                        {/* WRAPPER: Conditional Payment Fields */}
                         {formData.paymentType?.value === 'cash' ? (
                           <div className="grid grid-cols-2 gap-4">
                             <div className="relative">
                                <label className={floatingSelectLabel(formData.selectedStatus)}>Status*</label>
                                <Select options={statusOptions} onChange={(option) => updateFormData("selectedStatus", option)} value={formData.selectedStatus} isDisabled={formData.paymentType?.value === "installment"} required={formData.paymentType?.value === 'cash'} />
                             </div>
                             <div className="relative">
                                <label className={floatingSelectLabel(formData.rentType)}>Rent Type</label>
                                <Select options={rentOptions} onChange={(option) => updateFormData("rentType", option)} value={formData.rentType} isDisabled={!formData.selectedStatus || formData.selectedStatus?.value === "sale"} />
                             </div>
                           </div>
                         ) : (
                           <div className="grid grid-cols-2 gap-4">
                             <FloatingLabelInput label="Down Payment" type="number" value={formData.downPayment} onChange={(e) => updateFormData("downPayment", e.target.value)} />
                             <FloatingLabelInput label="Installment Years" type="number" min={0} value={formData.insYears} onChange={(e) => updateFormData("insYears", e.target.value)} />
                             <FloatingLabelInput label="Monthly Price" type="number" min={0} value={formData.monthlyPrice} onChange={(e) => updateFormData("monthlyPrice", e.target.value)} />
                             <div className="relative">
                                <label className={floatingSelectLabel(formData.insType)}>Installment Type</label>
                                <Select options={insTypeOptions} value={formData.insType} onChange={(option) => updateFormData('insType', option)} />
                             </div>
                             <div className="relative">
                                <label className={floatingSelectLabel(formData.recieveDate)}>Handover Date</label>
                                <Select options={recieveDateOptions} value={formData.recieveDate} onChange={(option) => updateFormData('recieveDate', option)} />
                             </div>
                           </div>
                         )}
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col gap-4">
                        {/* Category Display */}
                         <div className="p-3 border rounded-md bg-gray-100 text-sm text-gray-700 w-full">
                           Category: <span className="font-semibold">{formData.selectedCategory?.charAt(0).toUpperCase() + formData.selectedCategory?.slice(1)}</span>
                         </div>

                        {/* WRAPPER: Category Specific Fields */}
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
                               <div className="relative">
                                <label className={floatingSelectLabel(formData.apartmentType)}>Type</label>
                                <Select options={apartmentTypes} onChange={(option) => updateFormData("apartmentType", option)} value={formData.apartmentType} />
                               </div>
                               <FloatingLabelInput label="Floor Number" type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} />
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
                            <FloatingLabelInput label="Beds" type="number" value={formData.beds} onChange={(e) => updateFormData('beds', e.target.value)} />
                            <FloatingLabelInput label="Baths" type="number" value={formData.baths} onChange={(e) => updateFormData('baths', e.target.value)} />
                            <FloatingLabelInput label="Area (m²)" type="number" value={formData.area} onChange={(e) => updateFormData('area', e.target.value)} />
                         </div>
                        
                        <FloatingLabelInput label="Developer" value={formData.developer} onChange={(e) => updateFormData("developer", e.target.value)} />
                         
                        <FloatingLabelInput
                            label="Property Location (Google Maps Link or <iframe>)"
                            as="textarea"
                            value={formData.propertyLocation}
                            onChange={(e) => updateFormData('propertyLocation', e.target.value)}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer h-24 resize-y"
                        />
                    </div>

                    {/* WRAPPER: Third Column */}
                    <div className="flex flex-col gap-4">
                        <FloatingLabelInput label="YouTube Links (comma-separated)" value={formData.youtubeLinks} onChange={(e) => updateFormData('youtubeLinks', e.target.value.replace(/ /g, '').split(','))} />
                         
                        <div>
                           <div className="flex gap-2 items-center mb-2">
                             <button type="button" onClick={() => setLanguage("en")} className={`py-1 px-3 text-xs rounded-full ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-stone-200'}`}>EN</button>
                             <button type="button" onClick={() => setLanguage("ar")} className={`py-1 px-3 text-xs rounded-full ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-stone-200'}`}>AR</button>
                           </div>
                           <div className="flex flex-col gap-2">
                             {language === "ar" ? (
                               <>
                                 <FloatingLabelInput label="العنوان" value={formData.title?.ar} onChange={(e) => updateFormData("title", { ...formData.title, ar: e.target.value })} />
                                 <FloatingLabelInput label="الـوصـف" as="textarea" value={formData.description?.ar} onChange={(e) => updateFormData("description", { ...formData.description, ar: e.target.value })} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 h-24 resize-y"/>
                                 <FloatingLabelInput label="تفاصيل" as="textarea" value={formData.about?.ar} onChange={(e) => updateFormData("about", { ...formData.about, ar: e.target.value })} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 h-24 resize-y"/>
                               </>
                             ) : (
                               <>
                                 <FloatingLabelInput label="Title" value={formData.title?.en} onChange={(e) => updateFormData("title", { ...formData.title, en: e.target.value })} />
                                 <FloatingLabelInput label="Description" as="textarea" value={formData.description?.en} onChange={(e) => updateFormData("description", { ...formData.description, en: e.target.value })} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 h-24 resize-y"/>
                                 <FloatingLabelInput label="About" as="textarea" value={formData.about?.en} onChange={(e) => updateFormData("about", { ...formData.about, en: e.target.value })} className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 h-24 resize-y"/>
                               </>
                             )}
                           </div>
                         </div>
                    </div>
                </div>

                {/* Action Buttons are unchanged */}
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={CloseEditModal} type="button" className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300">Cancel</button>
                    {isArchived ? (
                        <>
                            <button onClick={handleSaveOnly} type="button" className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-700 w-36 disabled:bg-gray-400" disabled={loading || isSaving} >
                                {isSaving ? <CgSpinner className="animate-spin text-2xl mx-auto" /> : "Save Only"}
                            </button>
                            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 w-36 disabled:bg-blue-400" disabled={loading || isSaving}>
                                {loading ? <CgSpinner className="animate-spin text-2xl mx-auto" /> : "Save & Publish"}
                            </button>
                        </>
                    ) : (
                        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 w-36 disabled:bg-blue-400" disabled={loading}>
                            {loading ? <CgSpinner className="animate-spin text-2xl mx-auto" /> : "Save Changes"}
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    </div>
  );
}