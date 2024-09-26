import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { regionOptionsEn } from "../../utils/data";
import { AnimatePresence, motion } from "framer-motion";
import { getDocumentData, updateDocument } from "../../utils/data";
import { CgSpinner } from "react-icons/cg";
import { useAllContext } from "../../context/AllContext";
import { IoMdCloseCircleOutline } from "react-icons/io";

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
}) {
  let [language, setLanguage] = useState("en");
  let { selectedProp } = useAllContext();
  let [region, setRegion] = useState(null);
  let [selectedImages, setSelectedImages] = useState([]);
  let [title, setTitle] = useState({ en: "", ar: "" });
  let [description, setDescription] = useState({ en: "", ar: "" }),
    [selectedStatus, setSelectedStatus] = useState(""),
    [error, setError] = useState({ isErr: false, content: "" }),
    [loading, setLoading] = useState(false),
    [paymentType, setPaymentType] = useState(PaymentOptions[0]),
    [insYears, setInsYears] = useState(0),
    [villaType, setVillaType] = useState(null),
    [selectedCategory, setSelectedCategory] = useState(""),
    priceRef = useRef(),
    bedroomsRef = useRef(),
    bathroomsRef = useRef(),
    downPaymentRef = useRef(),
    areaRef = useRef();

  useEffect(() => {
    async function getDocData() {
      let property = await getDocumentData(
        `${selectedProp.cName}s`,
        selectedProp.id
      );
      setRegion({ label: property.region?.en, value: property.region });
      setTitle({ en: property.title.en, ar: property.title.ar });
      setDescription({
        en: property.description.en,
        ar: property.description.ar,
      });
      setSelectedStatus(
        property.status === "sale"
          ? { label: "For Sale", value: "sale" }
          : { label: "For Rent", value: "rent" }
      );
      setSelectedImages(property.images);
      setPaymentType(
        property.paymentType === "cash"
          ? { label: "Cash", value: "cash" }
          : { label: "Installment", value: "installment" }
      );
      setSelectedCategory(property.category)
      setVillaType(property.villaType)
      property.paymentType === "installment" && setInsYears(property.insYears);
      priceRef.current.value = property.price;
      bedroomsRef.current.value = property.beds;
      bathroomsRef.current.value = property.baths;
      areaRef.current.value = property.area;
      downPaymentRef.current.value = property.downPayment
    }
    getDocData();
    // eslint-disable-next-line
  }, [selectedProp]);

  function handlePaymentChange(option) {
    console.log(option);
    setPaymentType(option);
  }

  function handleInsYears(e) {
    setInsYears(e.target.value);
  }

  function handleStatusChange(option) {
    setSelectedStatus(option);
    console.log("Selected Status:", option);
  }

  useEffect(() => {
    return () => (document.body.style.overflow = "auto");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !selectedStatus ||
      (paymentType.value === "installment" && !insYears) ||
      (paymentType.value === "installment" && !downPaymentRef.current.value) ||
      (selectedCategory === "villa" && !villaType) ||
      !paymentType ||
      selectedImages.length === 0 ||
      !title.en ||
      !title.ar ||
      !description.en ||
      !description.ar ||
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
      //const uploadedImageUrls = await handleUpload();

      let PropertyData = {
        area: areaRef.current.value,
        baths: bathroomsRef.current.value,
        beds: bedroomsRef.current.value,
        price: priceRef.current.value,
        category: selectedProp.cName,
        status: selectedStatus.value,
        paymentType: paymentType.value,
        description: {
          ar: description.ar,
          en: description.en,
        },
        region: region.value,
        images: selectedImages,
        title: {
          ar: title.ar,
          en: title.en,
        },
        ...(paymentType.value === "installment" && { insYears: insYears }),
        ...(paymentType.value === "installment" && { downPayment: downPaymentRef.current.value }),
        ...(selectedCategory === "villa" && { villaType: villaType }),
      };

      updateDocument(`${selectedProp.cName}s`, selectedProp.id, PropertyData);
      setLoading(false);
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

  function handleVillaTypeChange(event) {
    setVillaType(event.target.value)
  }


  async function handleImageAdd(e) {
    const files = Array.from(e.target.files);
    const handleUpload = async () => {
      const cloudName = "dpheca8vj";
      const uploadPreset = "realestateImages";

      const imagePromises = files.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", uploadPreset);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          console.log(data.secure_url);
          return data.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return null;
        }
      });

      const imageUrls = await Promise.all(imagePromises);
      const filteredUrls = imageUrls.filter((url) => url !== null);
      // setUploadedImages(filteredUrls); // Update state
      return filteredUrls; // Return the array of URLs
    };

    const uploadedImageUrls = await handleUpload();

    setSelectedImages((prev) => [...prev, ...uploadedImageUrls]);
  }

  function handleRegionChange(option) {
    setRegion(option);
    console.log("Selected Region:", option);
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

      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="relative w-[600px] max-w-full p-5 bg-white rounded">
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
            {selectedImages.map((img) => {
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
                      setSelectedImages((prev) =>
                        prev.filter((item) => item !== img)
                      )
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
              onChange={handleRegionChange}
              value={region}
            />
            <Select
              options={PaymentOptions}
              placeholder={"Payment..."}
              onChange={handlePaymentChange}
              value={paymentType}
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
              {selectedCategory === 'villa' && <motion.div initial={{height: 0}} animate={{height: 'auto'}} exit={{height: 0}} className="grid grid-cols-2 md:grid-cols-3 gap-1">
                <div class="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={handleVillaTypeChange}
                    id="standalone"
                    type="radio"
                    value="Standalone"
                    name="villaType"
                    class="text-blue-600 bg-gray-100 border-gray-300"
                    checked={villaType === 'Standalone'}
                  />
                  <label
                    htmlFor="standalone"
                    class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Standalone
                  </label>
                </div>
                <div class="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={handleVillaTypeChange}
                    id="townHouse"
                    type="radio"
                    value="Town house"
                    name="villaType"
                    class="text-blue-600 bg-gray-100 border-gray-300"
                    checked={villaType === 'Town house'}
                  />
                  <label
                    htmlFor="townHouse"
                    class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Town house
                  </label>
                </div>
                <div class="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={handleVillaTypeChange}
                    id="twinHouse"
                    type="radio"
                    value="Twin house"
                    name="villaType"
                    class="text-blue-600 bg-gray-100 border-gray-300"
                    checked={villaType === 'Twin house'}
                  />
                  <label
                    htmlFor="twinHouse"
                    class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Twin house
                  </label>
                </div>
              </motion.div>}
            </AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 ">
            <Select
              options={statusOptions}
              placeholder={"Status..."}
              onChange={handleStatusChange}
              value={selectedStatus}
            />
            <input
              ref={downPaymentRef}
              className="p-2 border text-sm rounded outline-none"
              type="number"
              disabled={paymentType.value === "cash"}
              placeholder="Down Payment..."
            />
            <input
              type="number"
              min={0}
              value={insYears}
              disabled={paymentType.value === "cash"}
              onChange={handleInsYears}
              className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1"
              placeholder="Installment Years..."
            />
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
                value={title.ar}
                onChange={(e) =>
                  setTitle((prev) => {
                    return { ...prev, ar: e.target.value };
                  })
                }
                className="p-2 border text-sm rounded outline-none w-full mb-1"
                type="text"
                placeholder="العنوان"
              />
            )}
            {language === "en" && (
              <input
                value={title.en}
                onChange={(e) =>
                  setTitle((prev) => {
                    return { ...prev, en: e.target.value };
                  })
                }
                className="p-2 border text-sm rounded outline-none w-full mb-1"
                type="text"
                placeholder="Title"
              />
            )}
            {language === "en" && (
              <textarea
                value={description.en}
                onChange={(e) =>
                  setDescription((prev) => {
                    return { ...prev, en: e.target.value };
                  })
                }
                placeholder="Description"
                className="w-full h-10 lg:h-24 border outline-none rounded resize-none p-2 text-sm"
              ></textarea>
            )}
            {language === "ar" && (
              <textarea
                value={description.ar}
                onChange={(e) =>
                  setDescription((prev) => {
                    return { ...prev, ar: e.target.value };
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
