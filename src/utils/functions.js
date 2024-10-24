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

const handleFormData = (property, setFormData) => {
  setFormData({
    region: { label: property.region?.en, value: property.region },
    title: { en: property.title.en, ar: property.title.ar },
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    area: property.area,
    description: { en: property.description.en, ar: property.description.ar },
    selectedStatus: property.paymentType === 'cash' ? 
      (property.status === "sale" ? { label: "For Sale", value: "sale" } : { label: "For Rent", value: "rent" }) 
      : { label: "For Sale", value: "sale" },
    selectedImages: property.images,
    paymentType: property.paymentType === "cash" 
      ? { label: "Cash", value: "cash" } 
      : { label: "Installment", value: "installment" },
    selectedCategory: property.category,
    ...(property.paymentType === 'installment' && {insYears: property.insYears ? property.insYears : 0, downPayment: property.downPayment ? property.downPayment : 0}),
    ...(property.category === 'villa' && {villaType: property.villaType !== 'N/A' ? property.villaType : 'N/A'}),
    ...(property.category === 'retail' && {retailType: property.retailType !== 'N/A' ? property.retailType : 'N/A'}),
    ...(property.category === "apartment" && {
      floor: property.floor !== 'N/A' ? property.floor : 'N/A',
      apartmentType: property.apartmentType !== 'N/A' ? {label: property.apartmentType, value: property.apartmentType} : 'N/A'
    }),
    ...(property.status === 'rent' && {rentType: property.rentType !== 'N/A' ? property.rentType === "daily" 
      ? { label: "Daily", value: "daily" } 
      : { label: "Monthly", value: "monthly" }
    : 'N/A'})
  });
};

export const fetchAndSetPropertyData = async (selectedProp, setFormData) => {
  try {
    const property = await getDocumentData(`${selectedProp.cName}s`, selectedProp.id);
    console.log('Property : ', property)
    handleFormData(property, setFormData);
  } catch (error) {
    console.error("Error fetching property data:", error);
  }
};

export function validateForm(formData) {
  if (
    !formData.selectedCategory ||
    (formData.paymentType.value === 'cash' && !formData.selectedStatus) ||
    !formData.paymentType ||
    !formData.region
  ) {
    return false;
  }
  return true;
}

export function buildPropertyData(formData) {
  let propertyData = {
    area: formData.area,
    baths: formData.baths,
    beds: formData.beds,
    price: formData.price,
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
      insYears: formData.insYears ? formData.insYears : 0,
      downPayment: formData.downPayment ? formData.downPayment : 0,
    }),
    ...(formData.selectedCategory === "villa" && {
      villaType: formData.villaType,
    }),
    ...(formData.selectedStatus.value === "rent" && {
      rentType: formData.rentType !== 'N/A' ? formData.rentType.value : 'N/A',
    }),
    ...(formData.selectedCategory === "apartment" && {
      floor: formData.floor !== 'N/A' ? formData.floor : 'N/A',
      apartmentType: formData.apartmentType !== 'N/A' ? formData.apartmentType.value : 'N/A'
    })
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

