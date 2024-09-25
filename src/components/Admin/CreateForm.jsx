import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { addToCollection } from "../../utils/data";
import { CgSpinner } from "react-icons/cg";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { regionOptionsEn } from "../../utils/data";

const statusOptions = [
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
];

const PaymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "Installment", value: "installment" },
];

export default function CreateForm({
  CloseModal,
  setSingleImage,
  setSingleModal,
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
    downPaymentRef = useRef(),
    priceRef = useRef(),
    bedroomsRef = useRef(),
    bathroomsRef = useRef(),
    areaRef = useRef();

  function handleRegionChange(option) {
    setRegion(option);
    console.log("Selected Region:", option);
  }

  function handleStatusChange(option) {
    setSelectedStatus(option);
    console.log("Selected option:", option);
  }

  useEffect(() => {
    return () => (document.body.style.overflow = "auto");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !selectedCategory ||
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
      // Wait for handleUpload to complete and return the uploaded image URLs
      const uploadedImageUrls = await handleUpload();

      let PropertyData = {
        area: areaRef.current.value,
        baths: bathroomsRef.current.value,
        beds: bedroomsRef.current.value,
        price: priceRef.current.value,
        category: selectedCategory,
        status: selectedStatus.value,
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
        ...(paymentType.value === "installment" && { insYears: insYears }),
        ...(paymentType.value === "installment" && { downPayment: downPaymentRef.current.value }),
        ...(selectedCategory === "villa" && { villaType: villaType })
      };

      console.log(PropertyData);
      addToCollection(`${selectedCategory}s`, PropertyData);
      setLoading(false);
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

  const handleUpload = async () => {
    const cloudName = "dpheca8vj";
    const uploadPreset = "realestateImages";

    const imagePromises = selectedImages.map(async (image) => {
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

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    const imageArray = [];

    // Loop through all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        // Once file is read, add it to the array
        imageArray.push(reader.result);
        setSelectedImages((prevImages) => [...prevImages, reader.result]);
      };

      reader.readAsDataURL(file); // Convert file to data URL
    }

    //setSelectedImages(files);
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function handleVillaTypeChange(event) {
    setVillaType(event.target.value)
  }

  function handlePaymentChange(option) {
    setPaymentType(option);
  }

  function handleInsYears(e) {
    setInsYears(e.target.value);
  }

  return (
      <div

        className={`absolute w-full h-[calc(100vh-56px)] p-5 md:p-0 flex items-center justify-center left-0 z-20`}
        style={{ top: `${window.scrollY}px` }}
      >
        <div
          onClick={CloseModal}
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
                  className="flex flex-col items-center justify-center w-full h-12 lg:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                    <p className="hidden lg:block mb-2 text-sm text-gray-500">
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
                type="text"
                placeholder="Price"
              />

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              <div class="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="apartment"
                  type="radio"
                  value="apartment"
                  name="category"
                  class="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="apartment"
                  class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Apartment
                </label>
              </div>
              <div class="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="villa"
                  type="radio"
                  value="villa"
                  name="category"
                  class="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="villa"
                  class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Villa
                </label>
              </div>
              {/* <div class="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="office"
                  type="radio"
                  value="office"
                  name="category"
                  class="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="office"
                  class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Office
                </label>
              </div> */}
              <div class="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="house"
                  type="radio"
                  value="house"
                  name="category"
                  class="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="house"
                  class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  House
                </label>
              </div>
              <div class="flex items-center ps-2 border border-gray-200 rounded">
                <input
                  onClick={handleCategoryChange}
                  id="studio"
                  type="radio"
                  value="studio"
                  name="category"
                  class="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  for="studio"
                  class="w-full py-2 ms-1.5 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Studio
                </label>
              </div>
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


            <div className="grid grid-cols-3 gap-1 *:py-2 *:border *:p-2 *:text-sm *:rounded *:outline-none">
              <input ref={bedroomsRef} type="number" placeholder="Bedrooms" />
              <input ref={bathroomsRef} type="number" placeholder="Bathrooms" />
              <input ref={areaRef} type="number" placeholder="Area (Sq/M)" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 ">
              <Select
                options={statusOptions}
                placeholder={"Status..."}
                onChange={handleStatusChange}
              />
              <input
                ref={downPaymentRef}
                className="p-2 border text-sm rounded outline-none"
                type="number"
                min={0}
                disabled={paymentType.value === "cash"}
                placeholder="Down Payment"
              />
              <input
                type="number"
                min={1}
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
                onClick={CloseModal}
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
                  "Create"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
  );
}
