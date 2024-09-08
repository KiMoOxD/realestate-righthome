import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase.js"; // Import your Firebase setup

export async function getApartments() {
  const apartmentsCollection = collection(db, "apartments"); // Make sure 'apartments' is correct
  const apartmentsSnapshot = await getDocs(apartmentsCollection);
  const apartmentsList = apartmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return apartmentsList;
}

export async function getCollectionData(collection) {
  const apartmentsCollection = collection(db, collection); // Make sure 'apartments' is correct
  const apartmentsSnapshot = await getDocs(apartmentsCollection);
  const apartmentsList = apartmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return apartmentsList;
}


export async function getDocumentData(collection, id) {
  try {
    // Reference to the specific document
    const docRef = doc(db, collection, id); // Replace with your collection name and document ID
    // Fetch the document
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('Error Fetching Document: id Doesn`t Exist!')
    }
  } catch (err) {
    console.log(err);
    return 0
  }
}

export async function AddToApartments(apartmentData) {
  try {
    const apartmentsCollection = collection(db, "apartments");
    // Add a new document with a generated ID
    const docRef = await addDoc(apartmentsCollection, apartmentData);

    console.log("Apartment added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding apartment: ", error);
  }
}
