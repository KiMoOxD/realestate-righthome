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
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
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

export default function CreateForm({
  CloseModal,
  setSingleImage,
  setSingleModal,
  setConfirmMsg
}) {
  let [language, setLanguage] = useState("en"),
    [formData, setFormData] = useState(initialFormData),
    [error, setError] = useState({ isErr: false, content: "" }),
    [loading, setLoading] = useState(false);
  let queryClient = useQueryClient();


  useEffect(() => {
    return () => (document.body.style.overflow = "auto");
  }, []);

  const addPropertyMutation = useMutation({
    mutationFn: ({ collectionName, PropertyData }) => addToCollection(collectionName, PropertyData),
    onSuccess: () => {
      queryClient.invalidateQueries(['propertiesTable']);
    },
  });

  const updateFormData = (field, value) => {
    setFormData(prevState => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !formData.selectedCategory ||
      (formData.paymentType.value === 'cash' && !formData.selectedStatus) ||
      !formData.paymentType ||
      !formData.region
    ) {
      setError({ isErr: true, content: "All fields must be filled out." });
      setTimeout(() => {
        setError({ isErr: false, content: "" });
      }, 3000);
      console.error("All fields must be filled out.");
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrls = await handleUpload(formData.selectedImages);

      let PropertyData = {
        area: formData.area ? formData.area : 0,
        baths: formData.bathrooms ? formData.bathrooms : 0,
        beds: formData.bedrooms ? formData.bedrooms : 0,
        price: formData.price ? formData.price : 0,
        category: formData.selectedCategory,
        status: formData.paymentType.value === 'cash' ? formData.selectedStatus.value : 'sale',
        paymentType: formData.paymentType.value,
        about: {
          ar: formData.about.ar ? formData.about.ar : 'لا يوجد تفاصيل',
          en: formData.about.en ? formData.about.en : 'There is no About',
        },
        description: {
          ar: formData.description.ar ? formData.description.ar : 'لا يوجد وصف',
          en: formData.description.en ? formData.description.en : 'There is no description',
        },
        region: formData.region.value,
        images: uploadedImageUrls.length ? uploadedImageUrls : [`${defImg}`], // Use the returned URLs directly
        title: {
          ar: formData.title.ar ? formData.title.ar : `لا يوجد عنوان`,
          en: formData.title.en ? formData.title.en : 'There is no Title',
        },
        developer: formData.developer ? formData.developer : 'N/A',
        youtubeLinks: formData.youtubeLinks,
        ...(formData.paymentType.value === "installment" && { insYears: formData.insYears ? formData.insYears : 0, downPayment: formData.downPayment ? formData.downPayment : 0, insType: formData.insType ? formData.insType.value : 'N/A', recieveDate: formData.recieveDate ? formData.recieveDate.value : 'N/A', monthlyPrice: formData.monthlyPrice ? formData.monthlyPrice : 0 }),
        ...(formData.selectedCategory === "villa" && { villaType: formData.villaType ? formData.villaType : 'N/A' }),
        ...(formData.selectedCategory === "retail" && { retailType: formData.retailType ? formData.retailType : 'N/A' }),
        ...(formData.selectedStatus.value === "rent" && { rentType: formData.rentType ? formData.rentType.value : 'N/A' }),
        ...(formData.selectedCategory === "apartment" && {
          floor: formData.floor ? formData.floor : 'N/A',
          apartmentType: formData.apartmentType ? formData.apartmentType.value : 'N/A'
        })
      };

      addPropertyMutation.mutate({ collectionName: `${formData.selectedCategory}s`, PropertyData });
      setLoading(false);
      setConfirmMsg({ show: true, status: true, content: 'Property Added Successfully.' })
      setTimeout(() => {
        setConfirmMsg({ show: false, status: true, content: '' })
      }, 2000)
      CloseModal();
    } catch (error) {
      console.error("Error during submission:", error);
      setError({
        isErr: true,
        content: "An error occurred during submission.",
      });
      setTimeout(() => {
        setError({ isErr: false, content: "" });
      }, 3000);
    }
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setFormData(prevState => {
          return {
            ...prevState,
            selectedImages: [...prevState.selectedImages, reader.result],
          };
        });
      };

      reader.readAsDataURL(file);
    });
  }


  return (
    <div

      className={`absolute w-full h-[calc(100vh-56px)] p-5 md:p-0 flex items-center justify-center left-0 z-20`}
      style={{ top: `${window.scrollY}px` }}
    >
      <div
        // onClick={CloseModal}
        className="absolute w-full h-full bg-black/80"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[700px] max-w-full p-5 bg-white rounded"
      >
        <AnimatePresence>
          {error.isErr && (
            <motion.p
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="text-center text-sm py-1 bg-red-500 text-red-100"
            >
              {error.content}
            </motion.p>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {formData.selectedImages.map((img) => {
              return (
                <div key={img} className="relative cursor-pointer border h-fit rounded hover:border-blue-600 transition">
                  <img
                    src={img}
                    alt=""
                    className="size-8 md:size-10 object-cover rounded"
                    onClick={() => {
                      setSingleImage(img);
                      setSingleModal(true);
                    }}
                  />
                  <IoMdCloseCircleOutline
                    className="absolute top-0 left-full translate-x-[-50%] translate-y-[-50%] text-blue-700 text-base bg-white rounded-full z-10"
                    onClick={() =>
                      updateFormData('selectedImages', formData.selectedImages.filter((item) => item !== img))
                    }
                  />
                </div>
              );
            })}
            {formData.selectedImages.length > 0 && (
              <div className="size-8 md:size-10 bg-stone-100 flex items-center justify-center border rounded hover:shadow cursor-pointer">
                <label
                  htmlFor="dropzone-file"
                  className="text-stone-400 text-xl cursor-pointer"
                >
                  +
                  <input
                    id="dropzone-file"
                    onChange={handleImageChange}
                    type="file"
                    className="hidden cursor-pointer"
                    multiple
                  />
                </label>
              </div>
            )}
          </div>

          {formData.selectedImages.length === 0 && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-12 lg:h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 ;g:mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="hidden lg:block mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="hidden lg:block text-xs text-gray-500">
                    PNG or JPG
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  onChange={handleImageChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Select
              options={regionOptionsEn}
              placeholder={"Region*"}
              onChange={(option) => updateFormData('region', option)}
            />
            <Select
              options={PaymentOptions}
              placeholder={"Payment*"}
              onChange={(option) => updateFormData('paymentType', option)}
            />
            <input
              value={formData.price}
              onChange={(e) => updateFormData('price', e.target.value)}
              className="p-2 border text-sm rounded outline-none col-span-2 md:col-span-1"
              type="text"
              min={0}
              placeholder="Price..."
            />
          </div>

          <div className={`grid grid-cols-3 gap-1`}>
            {formData.paymentType.value === 'cash' && <Select
              options={statusOptions}
              placeholder={"Status*"}
              onChange={(option) => updateFormData('selectedStatus', option)}
            />}
            {formData.paymentType.value === "installment" && <input
              onChange={(e) => updateFormData('downPayment', e.target.value)}
              className="p-2 border text-sm rounded outline-none"
              type="number"
              min={0}
              placeholder="Down Payment"
            />}
            {formData.paymentType.value === "installment" && <input
              type="number"
              min={1}
              onChange={(e) => updateFormData('insYears', e.target.value)}
              className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1"
              placeholder="Installment Years..."
            />}
            {formData.paymentType.value === "installment" && <input
              onChange={(e) => updateFormData('monthlyPrice', e.target.value)}
              className="p-2 border text-sm rounded outline-none"
              type="number"
              min={0}
              placeholder="Monthly Price..."
            />}
            {formData.paymentType.value === 'cash' && <Select
              options={rentOptions}
              placeholder={"Rent Type..."}
              onChange={(option) => updateFormData('rentType', option)}
              isDisabled={formData.selectedStatus.value === 'sale'}
            />}
            {formData.paymentType.value === "installment" && <Select
              options={insTypeOptions}
              placeholder={"Installment Type..."}
              onChange={(option) => updateFormData('insType', option)}
            />}
            {formData.paymentType.value === "installment" && <Select
              options={recieveDateOptions}
              placeholder={"Handover Date..."}
              onChange={(option) => updateFormData('recieveDate', option)}
            />}
            <input
              onChange={(e) => updateFormData('developer', e.target.value)}
              className="p-2 border text-sm rounded outline-none"
              type="text"
              placeholder="Developer..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <div className="flex items-center ps-2 border border-gray-200 rounded">
              <input
                onClick={(e) => updateFormData('selectedCategory', e.target.value)}
                id="apartment"
                type="radio"
                value="apartment"
                name="category"
                className="text-blue-600 bg-gray-100 border-gray-300"
              />
              <label
                htmlFor="apartment"
                className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
              >
                Apartment*
              </label>
            </div>
            <div className="flex items-center ps-2 border border-gray-200 rounded">
              <input
                onClick={(e) => updateFormData('selectedCategory', e.target.value)}
                id="villa"
                type="radio"
                value="villa"
                name="category"
                className="text-blue-600 bg-gray-100 border-gray-300"
              />
              <label
                htmlFor="villa"
                className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
              >
                Villa*
              </label>
            </div>
            <div className="flex items-center ps-2 border border-gray-200 rounded">
              <input
                onClick={(e) => updateFormData('selectedCategory', e.target.value)}
                id="retail"
                type="radio"
                value="retail"
                name="category"
                className="text-blue-600 bg-gray-100 border-gray-300"
              />
              <label
                htmlFor="retail"
                className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
              >
                Retail*
              </label>
            </div>
            <div className="flex items-center ps-2 border border-gray-200 rounded">
              <input
                onClick={(e) => updateFormData('selectedCategory', e.target.value)}
                id="house"
                type="radio"
                value="house"
                name="category"
                className="text-blue-600 bg-gray-100 border-gray-300"
              />
              <label
                htmlFor="house"
                className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
              >
                House*
              </label>
            </div>
          </div>

          <AnimatePresence>
            {formData.selectedCategory === 'villa' && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-1">
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={(e) => updateFormData('villaType', e.target.value)}
                  id="standalone"
                  type="radio"
                  value="Standalone"
                  name="villaType"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="standalone"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Standalone
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={(e) => updateFormData('villaType', e.target.value)}
                  id="townHouse"
                  type="radio"
                  value="Town house"
                  name="villaType"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="townHouse"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Town house
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={(e) => updateFormData('villaType', e.target.value)}
                  id="twinHouse"
                  type="radio"
                  value="Twin house"
                  name="villaType"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="twinHouse"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Twin house
                </label>
              </div>
            </motion.div>}
          </AnimatePresence>

          <AnimatePresence>
            {formData.selectedCategory === 'apartment' && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="grid grid-cols-2 gap-1">
              <Select
                options={apartmentTypes}
                placeholder={"Type..."}
                onChange={(option) => updateFormData('apartmentType', option)}
              />
              <input type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} placeholder="Floor Number..." className="ps-2 outline-none border text-sm" />
            </motion.div>}
          </AnimatePresence>

          <AnimatePresence>
            {formData.selectedCategory === 'retail' && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-1">
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={(e) => updateFormData('retailType', e.target.value)}
                  id="office"
                  type="radio"
                  value="Office"
                  name="retailType"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="office"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Office
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={(e) => updateFormData('retailType', e.target.value)}
                  id="clinic"
                  type="radio"
                  value="Clinic"
                  name="retailType"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="clinic"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Clinic
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={(e) => updateFormData('retailType', e.target.value)}
                  id="shop"
                  type="radio"
                  value="Shop"
                  name="retailType"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="shop"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Shop
                </label>
              </div>
            </motion.div>}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-1 *:py-2 *:border *:p-2 *:text-sm *:rounded *:outline-none">
            <input onChange={(e) => updateFormData('bedrooms', e.target.value)} type="number" min={0} max={10} placeholder="Bedrooms" />
            <input onChange={(e) => updateFormData('bathrooms', e.target.value)} type="number" min={0} max={10} placeholder="Bathrooms" />
            <input onChange={(e) => updateFormData('area', e.target.value)} type="number" min={0} placeholder="Area (Sq/M)" />
          </div>

          <div>
            <input type="text" value={formData.youtubeLinks} onChange={(e) => updateFormData('youtubeLinks', e.target.value.replace(' ', '').split(','))} placeholder="YoutubeLink1,YoutubeLink1,..." className="outline-none w-full p-2 rounded border text-sm" />
          </div>

          <div className="flex gap-1 items-center">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`bg-stone-200 p-1 text-xs rounded hover:bg-stone-300 ${language === 'en' && 'bg-stone-300'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              className={`bg-stone-200 p-1 text-xs rounded hover:bg-stone-300 ${language === 'ar' && 'bg-stone-300'}`}
            >
              AR
            </button>
          </div>
          <div>
            {language === "ar" && (
              <input
                value={formData.title.ar}
                onChange={(e) => updateFormData('title', { ...formData.title, ar: e.target.value })}
                className="p-2 border text-sm rounded outline-none w-full mb-1"
                type="text"
                placeholder="العنوان"
              />
            )}
            {language === "en" && (
              <input
                value={formData.title.en}
                onChange={(e) => updateFormData('title', { ...formData.title, en: e.target.value })}
                className="p-2 border text-sm rounded outline-none w-full mb-1"
                type="text"
                placeholder="Title"
              />
            )}
            {language === "en" && (
              <textarea
                value={formData.description.en}
                onChange={(e) => updateFormData('description', { ...formData.description, en: e.target.value })}
                placeholder="Description"
                className="w-full h-10 lg:h-16 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
            {language === "en" && (
              <textarea
                value={formData.about.en}
                onChange={(e) => updateFormData('about', { ...formData.about, en: e.target.value })}
                placeholder="About"
                className="w-full h-10 lg:h-16 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
            {language === "ar" && (
              <textarea
                value={formData.description.ar}
                onChange={(e) => updateFormData('description', { ...formData.description, ar: e.target.value })}
                placeholder="الـوصـف"
                className="w-full h-10 lg:h-16 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
            {language === "ar" && (
              <textarea
                value={formData.about.ar}
                onChange={(e) => updateFormData('about', { ...formData.about, ar: e.target.value })}
                placeholder="تفاصيل"
                className="w-full h-10 lg:h-16 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={CloseModal}
              type="button"
              className="bg-stone-200 text-stone-500 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded flex justify-center items-center"
            >

              {loading ? (
                <CgSpinner className="animate-spin text-lg" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
