import { getDocumentData, updateDocument } from "./data";

export let formattedPriceEn = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export let formattedPriceAR = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
});


export const handleUpload = async (images) => {
  const cloudName = process.env.REACT_APP_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

  const imagePromises = images.map(async (image) => {
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
  return filteredUrls; 
};

const handleFormData = (property, setFormData, priceRef, bedroomsRef, bathroomsRef, areaRef) => {
  setFormData({
    region: { label: property.region?.en, value: property.region },
    title: { en: property.title.en, ar: property.title.ar },
    description: { en: property.description.en, ar: property.description.ar },
    selectedStatus: property.paymentType === 'cash' ? 
      (property.status === "sale" ? { label: "For Sale", value: "sale" } : { label: "For Rent", value: "rent" }) 
      : { label: "For Sale", value: "sale" },
    selectedImages: property.images,
    paymentType: property.paymentType === "cash" 
      ? { label: "Cash", value: "cash" } 
      : { label: "Installment", value: "installment" },
    selectedCategory: property.category,
    villaType: property.villaType,
    insYears: property.paymentType === "installment" ? property.insYears : 0,
    floor: property.floor ? property.floor : null,
    rentType: property.status === 'rent' ? 
      (property.rentType === "daily" 
        ? { label: "Daily", value: "daily" } 
        : { label: "Monthly", value: "monthly" }) 
      : null,
    isChalet: (property.category === 'apartment' || property.category === 'studio') ? property.isChalet : false,
    downPayment: property.paymentType === 'installment' ? property.downPayment : null
  });

  // Set the ref values
  priceRef.current.value = property.price;
  bedroomsRef.current.value = property.beds;
  bathroomsRef.current.value = property.baths;
  areaRef.current.value = property.area;
};

export const fetchAndSetPropertyData = async (selectedProp, setFormData, priceRef, bedroomsRef, bathroomsRef, areaRef) => {
  try {
    const property = await getDocumentData(`${selectedProp.cName}s`, selectedProp.id);
    handleFormData(property, setFormData, priceRef, bedroomsRef, bathroomsRef, areaRef);
  } catch (error) {
    console.error("Error fetching property data:", error);
  }
};

export function validateForm(formData, priceRef, bedroomsRef, bathroomsRef, areaRef) {
  if (
    !formData.selectedStatus ||
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
    return false;
  }
  return true;
}

export function buildPropertyData(formData, priceRef, bedroomsRef, bathroomsRef, areaRef) {
  let propertyData = {
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
    ...(formData.selectedStatus.value === "rent" && {
      rentType: formData.rentType.value,
    }),
    ...((formData.selectedCategory === "apartment" || formData.selectedCategory === "studio") && {
      isChalet: formData.isChalet,
    }),
  };

  return propertyData;
}

export function setErrorMessage(setError, content) {
  setError({ isErr: true, content });
  setTimeout(() => {
    setError({ isErr: false, content: "" });
  }, 3000);
}

export function setConfirmMessage(setConfirmMsg, status, content) {
  setConfirmMsg({ show: true, status, content });
  setTimeout(() => {
    setConfirmMsg({ show: false, status, content: "" });
  }, 2000);
}

export async function updatePropertyData(selectedProp, propertyData, setConfirmMsg, closeModal, setLoading) {
  try {
    let res = await updateDocument(`${selectedProp.cName}s`, selectedProp.id, propertyData);
    setLoading(false);
    if (res === 0) {
      setConfirmMessage(setConfirmMsg, false, "Failed to Update.");
      closeModal();
      return;
    }
    setConfirmMessage(setConfirmMsg, true, "Property Updated Successfully.");
    closeModal();
  } catch (error) {
    console.error("Error during submission:", error);
    throw new Error("Submission failed.");
  }
}

