import { addToCollection } from '../utils/data';

const AddApartmentForm = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apartmentData =   {
      area: 150,
      baths: 2,
      beds: 3,
      price: 10000000,
      category: 'villa',
      description: {
        ar: "فيلا عائلية مريحة بالقرب من النيل.",
        en: "Comfortable family Villa near the Nile.",
      },
      governate: {
        ar: "القاهرة",
        en: "Cairo",
      },
      images: [
        "https://images.unsplash.com/photo-1551918120-9739bb14436b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      title: {
        ar: "شقة عائلية في القاهرة",
        en: "Family Apartment in Cairo",
      },
    }
    
    
      
      addToCollection('villas', apartmentData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Add Apartment</button>
    </form>
  );
};

export default AddApartmentForm;
