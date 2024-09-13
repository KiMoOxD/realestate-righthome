import { addToCollection } from '../utils/data';

const AddApartmentForm = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const officeData = {
      area: 240,
      baths: 4,
      beds: 5,
      price: 20000000,
      category: 'house',
      status: 'rent',
      description: {
        ar: "منزل فسيح للإيجار في حي هادئ.",
        en: "Spacious house for rent in a quiet neighborhood.",
      },
      governate: {
        ar: "شرم الشيخ",
        en: "Sharm El Sheikh",
      },
      images: [
        "https://images.unsplash.com/photo-1562677045-7d82e8f6c30c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1566934471-452382b42d4c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1552648272-4ae1c2e4cc30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ],
      title: {
        ar: "منزل للإيجار في شرم الشيخ",
        en: "House for Rent in Sharm El Sheikh",
      },
    }
    
    
    
      
      addToCollection('houses', officeData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Add Apartment</button>
    </form>
  );
};

export default AddApartmentForm;
