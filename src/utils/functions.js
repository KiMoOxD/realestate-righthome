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