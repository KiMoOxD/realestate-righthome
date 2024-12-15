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
import { CiImageOn } from "react-icons/ci";


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
  preview: 0
}

const initialErrorState = {
  isErr: false,
  content: "",
};

let insTypeOptions = [
  {label: 'Monthly', value: 'monthly'},
  {label: 'Three Months (Quarterly)', value: 'quarterly '},
]

let recieveDateOptions = [
  {label: 'Instant', value: 'instant'},
  {label: '1 Year', value: 1},
  {label: '2 Years', value: 2},
  {label: '3 Years', value: 3},
  {label: '4 Years', value: 4},
  {label: '5 Years', value: 5},
]

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
          <div className="flex flex-wrap gap-2">
            {formData.selectedImages.map((img, idx) => {
              console.log(formData.preview, idx)
              return (
                <div
                  key={img+idx}
                  className="relative cursor-pointer border rounded hover:border-blue-600 transition"
                >
                  <img
                    src={img}
                    alt=""
                    className="size-12 rounded"
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
                  <CiImageOn onClick={() => updateFormData('preview', idx)} className={`absolute bottom-0.5 left-0.5 ${formData.preview === idx ? 'bg-blue-700 text-white' : 'text-blue-700 bg-white'} text-base rounded z-10`} />
                </div>
              );
            })}
            <div className="size-12 bg-stone-100 flex items-center justify-center border rounded hover:shadow cursor-pointer">
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

          <div className={`grid grid-cols-3 gap-1`}>
            {formData.paymentType.value === "cash" && <Select
              options={statusOptions}
              placeholder={"Status..."}
              onChange={(option) => updateFormData("selectedStatus", option)}
              value={formData.selectedStatus}
              isDisabled={formData.paymentType.value === "installment"}
            />}
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
              <div className="relative">
                <input
                  onChange={(e) => updateFormData("downPayment", e.target.value)}
                  className="p-2 border text-sm rounded outline-none w-full"
                  type="number"
                  disabled={formData.paymentType.value === "cash"}
                  value={formData.downPayment}
                  placeholder="Down Payment..."
                />
                <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Down Payment</span>
              </div>
            )}
            {formData.paymentType.value === "installment" && (
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={formData.insYears}
                  disabled={formData.paymentType.value === "cash"}
                  onChange={(e) => updateFormData("insYears", e.target.value)}
                  className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1 w-full"
                  placeholder="Installment Years..."
                />
                <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Installment Years</span>
              </div>
            )}
            {formData.paymentType.value === "installment" && (
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={formData.monthlyPrice}
                  disabled={formData.paymentType.value === "cash"}
                  onChange={(e) => updateFormData("monthlyPrice", e.target.value)}
                  className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1 w-full"
                  placeholder="Installment Years..."
                />
                <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Monthly Price</span>
              </div>
            )}
            {formData.paymentType.value === "installment" && <Select
              options={insTypeOptions}
              placeholder={"Installment Type..."}
              value={formData.insType}
              onChange={(option) => updateFormData('insType', option)}
            />}
            {formData.paymentType.value === "installment" && <Select
              options={recieveDateOptions}
              placeholder={"Handover Date..."}
              value={formData.recieveDate}
              onChange={(option) => updateFormData('recieveDate', option)}
            />}
            <div className="relative">
                <input
                  type="text"
                  value={formData.developer}
                  onChange={(e) => updateFormData("developer", e.target.value)}
                  className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1 w-full"
                  placeholder="Developer"
                />
                <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Developer</span>
            </div>
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
              <div className="relative">
                <input type="number" value={formData.floor} onChange={(e) => updateFormData('floor', e.target.value)} placeholder="Floor Number..." className="ps-2 outline-none border text-sm w-full h-full rounded"/>
                <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Floor Number</span>
              </div>
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
                    onChange={(e) => updateFormData('retailType', e.target.value)}
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
                    onChange={(e) => updateFormData('retailType', e.target.value)}
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
                    onChange={(e) => updateFormData('retailType', e.target.value)}
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
            <div className="relative">
              <input value={formData.beds} onChange={(e) => updateFormData('beds', e.target.value)} type="number" placeholder="Bedrooms" />
              <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Bedrooms</span>
            </div>
            <div className="relative">
              <input value={formData.baths} onChange={(e) => updateFormData('baths', e.target.value)} placeholder="Bathrooms" />
              <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Bathrooms</span>
            </div>
            <div className="relative">
              <input value={formData.area} onChange={(e) => updateFormData('area', e.target.value)} type="number" placeholder="Area (Sq/M)" />
              <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Area</span>
            </div>       
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
          <div>
              <input type="text" value={formData.youtubeLinks} onChange={(e) => updateFormData('youtubeLinks', e.target.value.replace(' ', '').split(','))} placeholder="YoutubeLink1,YoutubeLink1,..." className="outline-none w-full p-2 rounded border text-sm"/>
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
              <div className="relative">
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
              <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Title</span>
              </div>
            )}
            {language === "en" && (
              <div className="relative">
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
              <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">Description</span>
              </div>
            )}
            {language === "en" && (
              <div className="relative">
              <textarea
                value={formData.about?.en}
                onChange={(e) =>
                  updateFormData("about", {
                    ...formData.about,
                    en: e.target.value,
                  })
                }
                placeholder="About"
                className="w-full h-10 lg:h-16 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
              <span className="absolute top-0 right-8 translate-y-[-50%] text-[10px] bg-white">About</span>
              </div>
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
            {language === "ar" && (
              <textarea
                value={formData.about?.ar}
                onChange={(e) =>
                  updateFormData("about", {
                    ...formData.about,
                    ar: e.target.value,
                  })
                }
                placeholder="تفاصيل"
                className="w-full h-10 lg:h-16 border outline-none rounded resize-none p-2 text-sm"
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
