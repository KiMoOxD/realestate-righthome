import { AddToApartments } from '../utils/data';

const AddApartmentForm = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apartmentData = {
      area: 180,  // Updated area
      baths: 3,   // Updated number of baths
      beds: 3,    // Updated number of beds
      price: 500000,
      description: {
        ar: "شقة فاخرة في قلب المدينة بتصميم عصري ومساحات واسعة.",  // Updated Arabic description
        en: "Luxury apartment in the heart of the city with modern design and spacious rooms.",  // Updated English description
      },
      governate: {
        ar: "الجيزة",  // Updated governate in Arabic
        en: "Giza",    // Updated governate in English
      },
      images: [
        "https://images.unsplash.com/photo-1560448204-e82f5f96e055?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // Image 1
        "https://images.unsplash.com/photo-1572120360610-d971b9b1e773?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // Image 2
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // Image 3
        "https://images.unsplash.com/photo-1605276371731-8408a09e93a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // Image 4
      ],
      title: {
        ar: "شقة فاخرة في المدينة",  // Updated title in Arabic
        en: "Luxury Apartment in the City",  // Updated title in English
      },
    };
    
      
      AddToApartments(apartmentData)
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <br />
      <label>
        Area:
        <input type="number" value={area} onChange={(e) => setArea(e.target.value)} required />
      </label>
      <br />
      <label>
        Beds:
        <input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} required />
      </label>
      <br />
      <label>
        Baths:
        <input type="number" value={baths} onChange={(e) => setBaths(e.target.value)} required />
      </label>
      <br />
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <br />
      <label>
        Images (comma separated URLs):
        <input type="text" value={images.join(', ')} onChange={(e) => setImages(e.target.value.split(', '))} required />
      </label>
      <br /> */}
      <button type="submit">Add Apartment</button>
    </form>
  );
};

export default AddApartmentForm;
