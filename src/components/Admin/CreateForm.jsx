import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { addToCollection } from "../../utils/data";
import { CgSpinner } from "react-icons/cg";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { regionOptionsEn } from "../../utils/data";
import { handleUpload } from "../../utils/functions";
import { statusOptions, PaymentOptions, rentOptions, apartmentTypes } from "../../utils/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export default function CreateForm({
  CloseModal,
  setSingleImage,
  setSingleModal,
  setConfirmMsg
}) {
  let [language, setLanguage] = useState("en"),
    [region, setRegion] = useState(null),
    [selectedImages, setSelectedImages] = useState([]),
    [title, setTitle] = useState({ en: "", ar: "" }),
    [description, setDescription] = useState({ en: "", ar: "" }),
    [selectedStatus, setSelectedStatus] = useState(""),
    [selectedCategory, setSelectedCategory] = useState(""),
    [error, setError] = useState({ isErr: false, content: "" }),
    [loading, setLoading] = useState(false),
    [paymentType, setPaymentType] = useState(PaymentOptions[0]),
    [insYears, setInsYears] = useState(0),
    [villaType, setVillaType] = useState(null),
    [floor, setFloor] = useState(0),
    [isChalet, setIsChalet] = useState(false),
    [rentType, setRentType] = useState(),
    [youtubeLinks, setYoutubeLinks] = useState([]),
    [apartmentType, setApartmentType] = useState(),
    [retailType, setRetailType] = useState(),
    downPaymentRef = useRef(),
    priceRef = useRef(),
    bedroomsRef = useRef(),
    bathroomsRef = useRef(),
    areaRef = useRef();
    let queryClient = useQueryClient();


  function handleRegionChange(option) {
    setRegion(option);
    console.log("Selected Region:", option);
  }

  function handleStatusChange(option) {
    setSelectedStatus(option);
    console.log("Selected option:", option);
  }

  function handleRentTypeChange(option) {
    setRentType(option);
    console.log("Selected option:", option);
  }

  useEffect(() => {
    return () => (document.body.style.overflow = "auto");
  }, []);

  const addPropertyMutation = useMutation({
    mutationFn: ({ collectionName, PropertyData }) => addToCollection(collectionName, PropertyData),
    onSuccess: () => {
      queryClient.invalidateQueries(['propertiesTable']);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !selectedCategory ||
      (paymentType.value === 'cash' && !selectedStatus) ||
      (paymentType.value === "installment" && !insYears) ||
      (paymentType.value === "installment" && !downPaymentRef.current.value) ||
      (selectedCategory === "villa" && !villaType) ||
      (selectedCategory === "apartment" && !apartmentType) ||
      (selectedCategory === "retail" && !retailType) ||
      !paymentType ||
      selectedImages.length === 0 ||
      !title.en ||
      !title.ar ||
      !description.en ||
      !description.ar ||
      !priceRef.current.value
    ) {
      console.log(selectedStatus)
      setError({ isErr: true, content: "All fields must be filled out." });
      setTimeout(() => {
        setError({ isErr: false, content: "" });
      }, 3000);
      console.error("All fields must be filled out.");
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrls = await handleUpload(selectedImages);

      let PropertyData = {
        area: areaRef.current.value ? areaRef.current.value : 0,
        baths: bathroomsRef.current.value ? bathroomsRef.current.value : 0,
        beds: bedroomsRef.current.value ? bedroomsRef.current.value : 0,
        price: priceRef.current.value,
        category: selectedCategory,
        status: paymentType.value === 'cash' ? selectedStatus.value : 'sale',
        paymentType: paymentType.value,
        description: {
          ar: description.ar,
          en: description.en,
        },
        region: region.value,
        images: uploadedImageUrls, // Use the returned URLs directly
        title: {
          ar: title.ar,
          en: title.en,
        },
        youtubeLinks: youtubeLinks,
        ...(paymentType.value === "installment" && { insYears: insYears, downPayment: downPaymentRef.current.value }),
        ...(selectedCategory === "villa" && { villaType: villaType }),
        ...(selectedCategory === "retail" && { retailType: retailType }),
        ...(selectedStatus.value === "rent" && { rentType: rentType.value }),
        ...(selectedCategory === "apartment" && { floor: floor, isChalet: isChalet, apartmentType: apartmentType.value })
      };
      console.log(PropertyData)
      addPropertyMutation.mutate({ collectionName: `${selectedCategory}s`, PropertyData });
      setLoading(false);
      setConfirmMsg({show: true, status: true, content: 'Property Added Successfully.'})
      setTimeout(() => {
        setConfirmMsg({show: false, status: true, content: ''})
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

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        imageArray.push(reader.result);
        setSelectedImages((prevImages) => [...prevImages, reader.result]);
      };

      reader.readAsDataURL(file);
    }
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function handleVillaTypeChange(event) {
    setVillaType(event.target.value)
  }

  function handleRetailTypeChange(event) {
    setRetailType(event.target.value)
  }

  function handlePaymentChange(option) {
    setPaymentType(option);
  }

  function handleApartmentType(option) {
    setApartmentType(option);
  }

  function handleInsYears(e) {
    setInsYears(e.target.value);
  }

  function handleIsChaletChange(e) {
    setIsChalet(e.target.checked)
  }

  function handleFloorChange(e) {
    setFloor(e.target.value)
  }

  function handleYoutubeLinks(e) {
    let CSLINKS = e.target.value
    CSLINKS = CSLINKS.replace(' ', '').split(',')
    setYoutubeLinks(CSLINKS)
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
            <div className="flex gap-2 flex-wrap">
              {selectedImages.map((img) => {
                return (
                  <div className="relative cursor-pointer border h-fit rounded hover:border-blue-600 transition">
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
                        setSelectedImages((prev) =>
                          prev.filter((item) => item !== img)
                        )
                      }
                    />
                  </div>
                );
              })}
              {selectedImages.length > 0 && (
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

            {selectedImages.length === 0 && (
              <div className="flex items-center justify-center w-full">
                <label
                  for="dropzone-file"
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
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
                placeholder={"Region..."}
                onChange={handleRegionChange}
              />
              <Select
                options={PaymentOptions}
                placeholder={"Payment..."}
                onChange={handlePaymentChange}
              />
              <input
                ref={priceRef}
                className="p-2 border text-sm rounded outline-none col-span-2 md:col-span-1"
                type="number"
                min={0}
                placeholder="Price*"
              />

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="apartment"
                  type="radio"
                  value="apartment"
                  name="category"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="apartment"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Apartment
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="villa"
                  type="radio"
                  value="villa"
                  name="category"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="villa"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Villa
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="house"
                  type="radio"
                  value="house"
                  name="category"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="house"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  House
                </label>
              </div>
              <div className="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="retail"
                  type="radio"
                  value="retail"
                  name="category"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="retail"
                  className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Retail
                </label>
              </div>
            </div>
            <AnimatePresence>
              {selectedCategory === 'villa' && <motion.div initial={{height: 0}} animate={{height: 'auto'}} exit={{height: 0}} className="grid grid-cols-2 md:grid-cols-3 gap-1">
                <div className="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={handleVillaTypeChange}
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
                    onClick={handleVillaTypeChange}
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
                    onClick={handleVillaTypeChange}
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
              {selectedCategory === 'apartment' && <motion.div initial={{height: 0}} animate={{height: 'auto'}} exit={{height: 0}} className="grid grid-cols-3 gap-1">
                <Select
                  options={apartmentTypes}
                  placeholder={"Type..."}
                  onChange={handleApartmentType}
                />
                <div className="flex items-center px-2 border border-gray-200 rounded">
                  <input
                    onChange={handleIsChaletChange}
                    id="chalet"
                    type="checkbox"
                    className="text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label
                    htmlFor="chalet"
                    className="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Chalet ?
                  </label>
                </div>
                <input type="number" onChange={handleFloorChange} placeholder="Floor Number..." className="ps-2 outline-none border text-sm"/>
              </motion.div>}
            </AnimatePresence>

            <AnimatePresence>
              {selectedCategory === 'retail' && <motion.div initial={{height: 0}} animate={{height: 'auto'}} exit={{height: 0}} className="grid grid-cols-2 md:grid-cols-3 gap-1">
                <div className="flex items-center ps-2 border border-gray-200 rounded">
                  <input
                    onClick={handleRetailTypeChange}
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
                    onClick={handleRetailTypeChange}
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
                    onClick={handleRetailTypeChange}
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
              <input ref={bedroomsRef} type="number" min={0} placeholder="Bedrooms" />
              <input ref={bathroomsRef} type="number" min={0} placeholder="Bathrooms" />
              <input ref={areaRef} type="number" min={0} placeholder="Area (Sq/M)" />
            </div>

            <div className={`grid grid-cols-2 gap-1 `}>
              {paymentType.value === 'cash' && <Select
                options={statusOptions}
                placeholder={"Status..."}
                onChange={handleStatusChange}
              />}
              {paymentType.value === "installment" && <input
                ref={downPaymentRef}
                className="p-2 border text-sm rounded outline-none"
                type="number"
                min={0}
                placeholder="Down Payment"
              />}
              {paymentType.value === "installment" && <input
                type="number"
                min={1}
                onChange={handleInsYears}
                className="py-2 border p-2 text-sm rounded outline-none col-span-2 sm:col-span-1"
                placeholder="Installment Years..."
              />}
              {paymentType.value === 'cash' && <Select
                options={rentOptions}
                placeholder={"Rent Type..."}
                onChange={handleRentTypeChange}
                isDisabled={selectedStatus.value === 'sale'}
              />}
            </div>
            <div>
              <input type="text" value={youtubeLinks} onChange={handleYoutubeLinks} placeholder="YoutubeLink1,YoutubeLink1,..." className="outline-none w-full p-2 rounded border text-sm"/>
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
                  value={title.ar}
                  onChange={(e) =>
                    setTitle((prev) => {
                      return { ...prev, ar: e.target.value };
                    })
                  }
                  className="p-2 border text-sm rounded outline-none w-full mb-1"
                  type="text"
                  placeholder="*العنوان"
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
                  placeholder="Title*"
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
                  placeholder="Description*"
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
                  placeholder="*الـوصـف"
                  className="w-full h-10 lg:h-24 border outline-none rounded resize-none p-2 text-sm"
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
