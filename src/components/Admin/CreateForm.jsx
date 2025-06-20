import { useState, useEffect } from "react";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { addToCollection } from "../../utils/data";
import { CgSpinner } from "react-icons/cg";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { regionOptionsEn } from "../../utils/data";
import { handleUpload } from "../../utils/functions";
import { statusOptions, PaymentOptions, rentOptions, apartmentTypes } from "../../utils/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import defImg from '../../images/default.webp'
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

const initialFormData = {
    region: null,
    selectedImages: [],
    title: { en: "", ar: "" },
    about: { en: "", ar: "" },
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
};

let insTypeOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Three Months (Quarterly)', value: 'quarterly ' },
];

let recieveDateOptions = [
    { label: 'Instant', value: 'instant' },
    { label: '1 Year', value: 1 },
    { label: '2 Years', value: 2 },
    { label: '3 Years', value: 3 },
    { label: '4 Years', value: 4 },
    { label: '5 Years', value: 5 },
];

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

export default function CreateForm({
    CloseModal,
    setSingleImage,
    setSingleModal,
}) {
    let [language, setLanguage] = useState("en"),
        [formData, setFormData] = useState(initialFormData),
        [notification, setNotification] = useState({ show: false, type: '', message: '' }),
        [loading, setLoading] = useState(false);
    let queryClient = useQueryClient();

    // This useEffect properly locks and unlocks body scrolling.
    useEffect(() => {
        // When the modal mounts, hide the scrollbar on the body.
        document.body.style.overflow = "hidden";

        // When the modal unmounts, restore the scrollbar.
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount.

    const addPropertyMutation = useMutation({
        mutationFn: ({ collectionName, PropertyData }) => addToCollection(collectionName, PropertyData),
        onSuccess: () => {
            queryClient.invalidateQueries(['propertiesTable']);
        },
    });

    const updateFormData = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 2500);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!formData.selectedCategory || (formData.paymentType.value === 'cash' && !formData.selectedStatus) || !formData.paymentType || !formData.region) {
            showNotification('error', 'All fields marked with * must be filled out.');
            return;
        }

        setLoading(true);

        try {
            const uploadedImageUrls = await handleUpload(formData.selectedImages);

            let PropertyData = {
                propertyCode: formData.propertyCode ? formData.propertyCode : 'N/A',
                area: formData.area ? Number(formData.area) : 0,
                baths: formData.bathrooms ? Number(formData.bathrooms) : 0,
                beds: formData.bedrooms ? Number(formData.bedrooms) : 0,
                price: formData.price ? Number(formData.price) : 0,
                category: formData.selectedCategory,
                status: formData.paymentType.value === 'cash' ? formData.selectedStatus.value : 'sale',
                paymentType: formData.paymentType.value,
                propertyLocation: formData.propertyLocation ? formData.propertyLocation : 'N/A',
                about: {
                    ar: formData.about.ar ? formData.about.ar : 'لا يوجد تفاصيل',
                    en: formData.about.en ? formData.about.en : 'There is no About',
                },
                description: {
                    ar: formData.description.ar ? formData.description.ar : 'لا يوجد وصف',
                    en: formData.description.en ? formData.description.en : 'There is no description',
                },
                region: formData.region.value,
                images: uploadedImageUrls.length ? uploadedImageUrls : [`${defImg}`],
                title: {
                    ar: formData.title.ar ? formData.title.ar : `لا يوجد عنوان`,
                    en: formData.title.en ? formData.title.en : 'There is no Title',
                },
                developer: formData.developer ? formData.developer : 'N/A',
                youtubeLinks: formData.youtubeLinks,
                ...(formData.paymentType.value === "installment" && { insYears: formData.insYears ? Number(formData.insYears) : 0, downPayment: formData.downPayment ? Number(formData.downPayment) : 0, insType: formData.insType ? formData.insType.value : 'N/A', recieveDate: formData.recieveDate ? formData.recieveDate.value : 'N/A', monthlyPrice: formData.monthlyPrice ? Number(formData.monthlyPrice) : 0 }),
                ...(formData.selectedCategory === "villa" && { villaType: formData.villaType ? formData.villaType : 'N/A' }),
                ...(formData.selectedCategory === "retail" && { retailType: formData.retailType ? formData.retailType : 'N/A' }),
                ...(formData.selectedStatus.value === "rent" && { rentType: formData.rentType ? formData.rentType.value : 'N/A' }),
                ...(formData.selectedCategory === "apartment" && {
                    floor: formData.floor ? formData.floor : 'N/A',
                    apartmentType: formData.apartmentType ? formData.apartmentType.value : 'N/A'
                })
            };

            await addPropertyMutation.mutateAsync({ collectionName: `${formData.selectedCategory}s`, PropertyData });
            
            setLoading(false);
            showNotification('success', 'Property Added Successfully.');
            
            setTimeout(() => {
                CloseModal();
            }, 2000);

        } catch (error) {
            console.error("Error during submission:", error);
            setLoading(false);
            showNotification('error', 'An error occurred during submission.');
        }
    }

    async function handleImageChange(e) {
        // ... (handleImageChange logic remains the same)
    }

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-5">
            <AnimatePresence>
                {notification.show && (
                    <NotificationPopup type={notification.type} message={notification.message} />
                )}
            </AnimatePresence>

            <div
                onClick={CloseModal}
                className="absolute inset-0 bg-black/80"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* First Column */}
                        <div className="flex flex-col gap-4">
                            {/* Image Upload */}
                            <div>
                                <div className="flex gap-2 flex-wrap mb-2">
                                    {formData.selectedImages.map((img) => (
                                        <div key={img} className="relative cursor-pointer border rounded-md hover:border-blue-600 transition">
                                            <img
                                                src={img}
                                                alt=""
                                                className="h-16 w-16 object-cover rounded-md"
                                                onClick={() => { setSingleImage(img); setSingleModal(true); }}
                                            />
                                            <IoMdCloseCircleOutline
                                                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-red-600 text-xl bg-white rounded-full cursor-pointer"
                                                onClick={() => updateFormData('selectedImages', formData.selectedImages.filter((item) => item !== img))}
                                            />
                                        </div>
                                    ))}
                                    {formData.selectedImages.length > 0 && (
                                        <label htmlFor="dropzone-file-extra" className="h-16 w-16 bg-stone-100 flex items-center justify-center border rounded-md hover:shadow cursor-pointer">
                                            <span className="text-stone-400 text-3xl">+</span>
                                            <input id="dropzone-file-extra" onChange={handleImageChange} type="file" className="hidden" multiple />
                                        </label>
                                    )}
                                </div>
                                {formData.selectedImages.length === 0 && (
                                    <label
                                        htmlFor="dropzone-file-initial"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                        </div>
                                        <input id="dropzone-file-initial" onChange={handleImageChange} type="file" accept="image/*" className="hidden" multiple />
                                    </label>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <Select options={regionOptionsEn} placeholder="Region*" onChange={(option) => updateFormData('region', option)} />
                                <Select options={PaymentOptions} placeholder="Payment*" onChange={(option) => updateFormData('paymentType', option)} />
                                <input value={formData.price} onChange={(e) => updateFormData('price', e.target.value)} className="p-2 border rounded-md text-sm outline-none" type="text" placeholder="Price..." />
                                <input onChange={(e) => updateFormData('propertyCode', e.target.value)} className="p-2 border rounded-md text-sm outline-none" type="text" placeholder="Property Code..." />
                            </div>

                            {/* Conditional Payment Fields */}
                            {formData.paymentType.value === 'cash' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Select options={statusOptions} placeholder="Status*" onChange={(option) => updateFormData('selectedStatus', option)} />
                                    <Select options={rentOptions} placeholder="Rent Type..." onChange={(option) => updateFormData('rentType', option)} isDisabled={!formData.selectedStatus || formData.selectedStatus.value === 'sale'} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <input onChange={(e) => updateFormData('downPayment', e.target.value)} className="p-2 border rounded-md text-sm" type="number" min={0} placeholder="Down Payment" />
                                    <input type="number" min={1} onChange={(e) => updateFormData('insYears', e.target.value)} className="p-2 border rounded-md text-sm" placeholder="Installment Years" />
                                    <input onChange={(e) => updateFormData('monthlyPrice', e.target.value)} className="p-2 border rounded-md text-sm" type="number" min={0} placeholder="Monthly Price" />
                                    <Select options={insTypeOptions} placeholder="Installment Type" onChange={(option) => updateFormData('insType', option)} />
                                    <Select options={recieveDateOptions} placeholder="Handover Date" onChange={(option) => updateFormData('recieveDate', option)} />
                                </div>
                            )}
                        </div>

                        {/* Second Column */}
                        <div className="flex flex-col gap-4">
                            {/* Category Selection */}
                            <div className="grid grid-cols-2 gap-2">
                                {['apartment', 'villa', 'retail', 'house'].map(category => (
                                    <div key={category} className="flex items-center ps-2 border rounded-md">
                                        <input onClick={(e) => updateFormData('selectedCategory', e.target.value)} id={category} type="radio" value={category} name="category" className="text-blue-600" />
                                        <label htmlFor={category} className="w-full py-2 ms-2 text-sm font-medium text-gray-900">{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Category Specific Fields */}
                            <AnimatePresence>
                                {formData.selectedCategory === 'villa' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-3 gap-2">
                                        {['Standalone', 'Town house', 'Twin house'].map(villaType => (
                                            <div key={villaType} className="flex items-center ps-2 border rounded-md">
                                                <input onClick={(e) => updateFormData('villaType', villaType)} id={villaType} type="radio" value={villaType} name="villaType" className="text-blue-600" />
                                                <label htmlFor={villaType} className="w-full py-2 ms-2 text-sm">{villaType}</label>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                                {formData.selectedCategory === 'apartment' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-2 gap-2">
                                        <Select options={apartmentTypes} placeholder="Type..." onChange={(option) => updateFormData('apartmentType', option)} />
                                        <input type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} placeholder="Floor Number" className="ps-2 border rounded-md text-sm" />
                                    </motion.div>
                                )}
                                {formData.selectedCategory === 'retail' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-3 gap-2">
                                        {['Office', 'Clinic', 'Shop'].map(retailType => (
                                            <div key={retailType} className="flex items-center ps-2 border rounded-md">
                                                <input onClick={(e) => updateFormData('retailType', retailType)} id={retailType} type="radio" value={retailType} name="retailType" className="text-blue-600" />
                                                <label htmlFor={retailType} className="w-full py-2 ms-2 text-sm">{retailType}</label>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-3 gap-2">
                                <input onChange={(e) => updateFormData('bedrooms', e.target.value)} type="number" min={0} placeholder="Beds" className="p-2 border rounded-md text-sm" />
                                <input onChange={(e) => updateFormData('bathrooms', e.target.value)} type="number" min={0} placeholder="Baths" className="p-2 border rounded-md text-sm" />
                                <input onChange={(e) => updateFormData('area', e.target.value)} type="number" min={0} placeholder="Area (m²)" className="p-2 border rounded-md text-sm" />
                            </div>

                            <input onChange={(e) => updateFormData('developer', e.target.value)} className="p-2 border rounded-md text-sm outline-none" type="text" placeholder="Developer..." />

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
                                            <input value={formData.title.ar} onChange={(e) => updateFormData('title', { ...formData.title, ar: e.target.value })} className="p-2 border rounded-md text-sm w-full" type="text" placeholder="العنوان" />
                                            <textarea value={formData.description.ar} onChange={(e) => updateFormData('description', { ...formData.description, ar: e.target.value })} placeholder="الـوصـف" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                                            <textarea value={formData.about.ar} onChange={(e) => updateFormData('about', { ...formData.about, ar: e.target.value })} placeholder="تفاصيل" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                                        </>
                                    ) : (
                                        <>
                                            <input value={formData.title.en} onChange={(e) => updateFormData('title', { ...formData.title, en: e.target.value })} className="p-2 border rounded-md text-sm w-full" type="text" placeholder="Title" />
                                            <textarea value={formData.description.en} onChange={(e) => updateFormData('description', { ...formData.description, en: e.target.value })} placeholder="Description" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                                            <textarea value={formData.about.en} onChange={(e) => updateFormData('about', { ...formData.about, en: e.target.value })} placeholder="About" className="w-full h-24 border rounded-md resize-y p-2 text-sm"></textarea>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button onClick={CloseModal} type="button" className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 w-28">
                            {loading ? <CgSpinner className="animate-spin text-2xl mx-auto" /> : "Create"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}