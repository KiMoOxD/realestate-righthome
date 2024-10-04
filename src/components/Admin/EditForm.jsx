import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { regionOptionsEn } from "../../utils/data";
import { AnimatePresence, motion } from "framer-motion";
import { getDocumentData, updateDocument } from "../../utils/data";
import { CgSpinner } from "react-icons/cg";
import { useAllContext } from "../../context/AllContext";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { handleUpload } from "../../utils/functions";

const statusOptions = [
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
];
const PaymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "Installment", value: "installment" },
];

export default function EditForm({
  CloseEditModal,
  setSingleImage,
  setSingleModal,
  setConfirmMsg
}) {
  let [language, setLanguage] = useState("en"),
    [formData, setFormData] = useState({
      region: null,
      selectedImages: [],
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      selectedStatus: "",
      paymentType: PaymentOptions[0],
      insYears: 0,
      villaType: null,
      selectedCategory: "",
      floor: 0,
      isChalet: false,
      rentType: null,
      downPayment: null,
    }),
    { selectedProp } = useAllContext(),
    [error, setError] = useState({ isErr: false, content: "" }),
    [loading, setLoading] = useState(false),
    priceRef = useRef(),
    bedroomsRef = useRef(),
    bathroomsRef = useRef(),
    areaRef = useRef();

  useEffect(() => {
    async function getDocData() {
      let property = await getDocumentData(
        `${selectedProp.cName}s`,
        selectedProp.id
      );
      setFormData({
        region: { label: property.region?.en, value: property.region },
        title: { en: property.title.en, ar: property.title.ar },
        description: {
          en: property.description.en,
          ar: property.description.ar,
        },
        selectedStatus: property.paymentType === 'cash' ?
          property.status === "sale"
            ? { label: "For Sale", value: "sale" }
            : { label: "For Rent", value: "rent" }
          :
            { label: "For Sale", value: "sale" },
        selectedImages: property.images,
        paymentType:
          property.paymentType === "cash"
            ? { label: "Cash", value: "cash" }
            : { label: "Installment", value: "installment" },
        selectedCategory: property.category,
        villaType: property.villaType,
        insYears:
          property.paymentType === "installment" ? property.insYears : 0,
        floor: property.floor ? property.floor : null,
        rentType: property.status === 'rent' ? property.rentType : null,
        isChalet: (property.category === 'apartment' || property.category === 'studio') ? property.isChalet : false,
        downPayment: property.paymentType === 'installment' ? property.downPayment : null
      });
      priceRef.current.value = property.price;
      bedroomsRef.current.value = property.beds;
      bathroomsRef.current.value = property.baths;
      areaRef.current.value = property.area;
    }
    getDocData();
    // eslint-disable-next-line
  }, [selectedProp]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    return () => (document.body.style.overflow = "auto");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.selectedStatus ||
      (formData.paymentType.value === "installment" && !formData.insYears) ||
      (formData.paymentType.value === "installment" && !formData.downPayment) ||
      (formData.selectedCategory === "villa" && !formData.villaType) ||
      !formData.paymentType ||
      formData.selectedImages.length === 0 ||
      !formData.title.en ||
      !formData.title.ar ||
      !formData.description.en ||
      !formData.description.ar ||
      !priceRef.current.value ||
      !bedroomsRef.current.value ||
      !bathroomsRef.current.value ||
      !areaRef.current.value
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
      let PropertyData = {
        area: areaRef.current.value,
        baths: bathroomsRef.current.value,
        beds: bedroomsRef.current.value,
        price: priceRef.current.value,
        category: formData.selectedCategory,
        status: formData.selectedStatus.value,
        paymentType: formData.paymentType.value,
        description: {
          ar: formData.description.ar,
          en: formData.description.en,
        },
        region: formData.region.value,
        images: formData.selectedImages,
        title: {
          ar: formData.title.ar,
          en: formData.title.en,
        },
        ...(formData.paymentType.value === "installment" && {
          insYears: formData.insYears,
        }),
        ...(formData.paymentType.value === "installment" && {
          downPayment: formData.downPayment,
        }),
        ...(formData.selectedCategory === "villa" && {
          villaType: formData.villaType,
        }),
      };

      let res = await updateDocument(`${selectedProp.cName}s`, selectedProp.id, PropertyData);
      console.log(res)
      setLoading(false);
      if (res === 0) {
        setConfirmMsg({show: true, status: false, content: 'Failed to Update.'})
        setTimeout(() => {
          setConfirmMsg({show: false, status: true, content: ''})
        }, 2000)
        CloseEditModal();
        return
      }
      setConfirmMsg({show: true, status: true, content: 'Property Updated Successfully.'})
      setTimeout(() => {
        setConfirmMsg({show: false, status: true, content: ''})
      }, 2000)
      CloseEditModal();
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

  async function handleImageAdd(e) {
    const files = Array.from(e.target.files);
    const uploadedImageUrls = await handleUpload(files);
    updateFormData("selectedImages", [
      ...formData.selectedImages,
      ...uploadedImageUrls,
    ]);
  }

  console.log(formData)

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
                <div className="relative cursor-pointer border rounded hover:border-blue-600 transition">
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
              ref={priceRef}
              className="p-2 border text-sm rounded outline-none col-span-2 md:col-span-1"
              type="text"
              placeholder="Price"
            />
          </div>
          <div className="grid grid-cols-3 gap-1 *:py-2 *:border *:p-2 *:text-sm *:rounded *:outline-none">
            <input ref={bedroomsRef} type="number" placeholder="Bedrooms" />
            <input ref={bathroomsRef} type="number" placeholder="Bathrooms" />
            <input ref={areaRef} type="number" placeholder="Area (Sq/M)" />
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
              isDisabled={formData.paymentType.value === 'installment'}
            />
            {formData.paymentType.value === 'installment' && <input
              onChange={(e) => updateFormData("downPayment", e.target.value)}
              className="p-2 border text-sm rounded outline-none"
              type="number"
              disabled={formData.paymentType.value === "cash"}
              value={formData.downPayment}
              placeholder="Down Payment..."
            />}
            {formData.paymentType.value === 'installment' && <input
              type="number"
              min={0}
              value={formData.insYears}
              disabled={formData.paymentType.value === "cash"}
              onChange={(e) => updateFormData("insYears", e.target.value)}
              className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1"
              placeholder="Installment Years..."
            />}
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
