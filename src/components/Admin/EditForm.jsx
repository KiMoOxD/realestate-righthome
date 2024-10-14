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
  setErrorMessage,
  updatePropertyData,
} from "../../utils/functions";

const initialFormData = {
  region: null,
  selectedImages: [],
  title: { en: "", ar: "" },
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

const initialErrorState = {
  isErr: false,
  content: "",
};

export default function EditForm({
  CloseEditModal,
  setSingleImage,
  setSingleModal,
  setConfirmMsg,
}) {
  
  const [language, setLanguage] = useState("en"),
        [formData, setFormData] = useState(initialFormData),
        [error, setError] = useState(initialErrorState),
        [loading, setLoading] = useState(false),
        { selectedProp } = useAllContext();
  console.log(formData)

  useEffect(() => {
    fetchAndSetPropertyData(
      selectedProp,
      setFormData,
    );
    return () => (document.body.style.overflow = "auto");
  }, [selectedProp, setFormData]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm(formData)) {
      setErrorMessage(setError, "All fields must be filled out.");
      console.error("All fields must be filled out.");
      return;
    }

    setLoading(true);

    try {
      const propertyData = buildPropertyData(
        formData
      );
      await updatePropertyData(
        selectedProp,
        propertyData,
        setConfirmMsg,
        CloseEditModal,
        setLoading
      );
    } catch (error) {
      setErrorMessage(setError, "An error occurred during submission.");
      setLoading(false)
      console.error(error)
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
    <div
      className={`absolute w-full h-[calc(100vh-56px)] p-5 md:p-0 flex items-center justify-center left-0 z-20`}
      style={{ top: `${window.scrollY}px` }}
    >
      <div
        onClick={CloseEditModal}
        className="absolute w-full h-full bg-black/80"
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[600px] max-w-full p-5 bg-white rounded"
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
          <div className="flex flex-wrap gap-2">
            {formData.selectedImages.map((img) => {
              return (
                <div
                  key={img}
                  className="relative cursor-pointer border rounded hover:border-blue-600 transition"
                >
                  <img
                    src={img}
                    alt=""
                    className="size-10 rounded"
                    onClick={() => {
                      setSingleImage(img);
                      setSingleModal(true);
                    }}
                  />
                  <IoMdCloseCircleOutline
                    className="absolute top-0 left-full translate-x-[-50%] translate-y-[-50%] text-blue-700 text-base bg-white rounded-full z-10"
                    onClick={() =>
                      setFormData((prev) => {
                        return {
                          ...prev,
                          selectedImages: formData.selectedImages.filter(
                            (item) => item !== img
                          ),
                        };
                      })
                    }
                  />
                </div>
              );
            })}
            <div className="size-10 bg-stone-100 flex items-center justify-center border rounded hover:shadow cursor-pointer">
              <label
                htmlFor="dropzone-file"
                className="text-stone-400 text-xl cursor-pointer"
              >
                +
                <input
                  id="dropzone-file"
                  onChange={handleImageAdd}
                  type="file"
                  className="hidden cursor-pointer"
                  multiple
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Select
              options={regionOptionsEn}
              placeholder={"Region..."}
              onChange={(option) => updateFormData("region", option)}
              value={formData.region}
            />
            <Select
              options={PaymentOptions}
              placeholder={"Payment..."}
              onChange={(option) => updateFormData("paymentType", option)}
              value={formData.paymentType}
            />
            <input
              onChange={(e) => updateFormData('price', e.target.value)}
              value={formData.price}
              className="p-2 border text-sm rounded outline-none col-span-2 md:col-span-1"
              type="text"
              placeholder="Price"
            />
          </div>
          <AnimatePresence>
            {formData.selectedCategory === "apartment" && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="grid grid-cols-2 gap-1"
              >
              <Select
                options={apartmentTypes}
                placeholder={"Type..."}
                onChange={(option) => updateFormData("apartmentType", option)}
                value={formData.apartmentType}
              />
              <input type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} placeholder="Floor Number..." className="ps-2 outline-none border text-sm"/>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {formData.selectedCategory === "retail" && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-1"
              >
                <div className="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={(e) => updateFormData('retailType', e.target.value)}
                    id="office"
                    type="radio"
                    value="Office"
                    name="retailType"
                    className="text-blue-600 bg-gray-100 border-gray-300"
                    checked={formData.retailType === 'Office'}
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
                    checked={formData.retailType === 'Clinic'}
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
                    checked={formData.retailType === 'Shop'}
                  />
                  <label
                    htmlFor="shop"
                    className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Shop
                  </label>
                </div>
              {/* <input type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} placeholder="Floor Number..." className="ps-2 outline-none border text-sm"/> */}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-3 gap-1 *:py-2 *:border *:p-2 *:text-sm *:rounded *:outline-none">
            <input value={formData.beds} onChange={(e) => updateFormData('beds', e.target.value)} type="number" placeholder="Bedrooms" />
            <input value={formData.baths} onChange={(e) => updateFormData('baths', e.target.value)} placeholder="Bathrooms" />
            <input value={formData.area} onChange={(e) => updateFormData('area', e.target.value)} type="number" placeholder="Area (Sq/M)" />
          </div>
          <AnimatePresence>
            {formData.selectedCategory === "villa" && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-1"
              >
                <div className="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={(e) => updateFormData("villaType", e.target.value)}
                    id="standalone"
                    type="radio"
                    value="Standalone"
                    name="villaType"
                    className="text-blue-600 bg-gray-100 border-gray-300"
                    checked={formData.villaType === "Standalone"}
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
                    onClick={(e) => updateFormData("villaType", e.target.value)}
                    id="townHouse"
                    type="radio"
                    value="Town house"
                    name="villaType"
                    className="text-blue-600 bg-gray-100 border-gray-300"
                    checked={formData.villaType === "Town house"}
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
                    onClick={(e) => updateFormData("villaType", e.target.value)}
                    id="twinHouse"
                    type="radio"
                    value="Twin house"
                    name="villaType"
                    className="text-blue-600 bg-gray-100 border-gray-300"
                    checked={formData.villaType === "Twin house"}
                  />
                  <label
                    htmlFor="twinHouse"
                    className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Twin house
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 ">
            <Select
              options={statusOptions}
              placeholder={"Status..."}
              onChange={(option) => updateFormData("selectedStatus", option)}
              value={formData.selectedStatus}
              isDisabled={formData.paymentType.value === "installment"}
            />
            {formData.paymentType.value === "cash" && (
              <Select
                options={rentOptions}
                placeholder={"Rent Type..."}
                onChange={(option) => updateFormData("rentType", option)}
                value={formData.rentType}
                isDisabled={formData.selectedStatus.value === "sale"}
              />
            )}
            {formData.paymentType.value === "installment" && (
              <input
                onChange={(e) => updateFormData("downPayment", e.target.value)}
                className="p-2 border text-sm rounded outline-none"
                type="number"
                disabled={formData.paymentType.value === "cash"}
                value={formData.downPayment}
                placeholder="Down Payment..."
              />
            )}
            {formData.paymentType.value === "installment" && (
              <input
                type="number"
                min={0}
                value={formData.insYears}
                disabled={formData.paymentType.value === "cash"}
                onChange={(e) => updateFormData("insYears", e.target.value)}
                className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1"
                placeholder="Installment Years..."
              />
            )}
          </div>
          <div className="flex gap-1 items-center">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className="bg-stone-200 p-1 text-xs rounded hover:bg-stone-300"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              className="bg-stone-200 p-1 text-xs rounded hover:bg-stone-300"
            >
              AR
            </button>
          </div>
          <div>
            {language === "ar" && (
              <input
                value={formData.title.ar}
                onChange={(e) =>
                  updateFormData("title", {
                    ...formData.title,
                    ar: e.target.value,
                  })
                }
                className="p-2 border text-sm rounded outline-none w-full mb-1"
                type="text"
                placeholder="العنوان"
              />
            )}
            {language === "en" && (
              <input
                value={formData.title.en}
                onChange={(e) =>
                  updateFormData("title", {
                    ...formData.title,
                    en: e.target.value,
                  })
                }
                className="p-2 border text-sm rounded outline-none w-full mb-1"
                type="text"
                placeholder="Title"
              />
            )}
            {language === "en" && (
              <textarea
                value={formData.description.en}
                onChange={(e) =>
                  updateFormData("description", {
                    ...formData.description,
                    en: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full h-10 lg:h-24 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
            {language === "ar" && (
              <textarea
                value={formData.description.ar}
                onChange={(e) =>
                  updateFormData("description", {
                    ...formData.description,
                    ar: e.target.value,
                  })
                }
                placeholder="الـوصـف"
                className="w-full h-10 lg:h-24 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={CloseEditModal}
              className="bg-stone-200 text-stone-500 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {" "}
              {loading ? (
                <CgSpinner className="animate-spin text-lg" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
