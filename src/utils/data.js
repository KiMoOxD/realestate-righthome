import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { db } from "../utils/firebase.js"; // Import your Firebase setup

export async function getCollectionData(collectionName) {

  if (collectionName === 'all') {
    let allData = await getAllCollectionsData();
    return allData
  }
  
  const apartmentsCollection = collection(db, collectionName); // Make sure 'apartments' is correct
  const apartmentsSnapshot = await getDocs(apartmentsCollection);
  const apartmentsList = apartmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return apartmentsList;
}

export async function getAllCollectionsData() {
  let apartments = await getCollectionData('apartments');
  let villas = await getCollectionData('villas');
  let retails = await getCollectionData('retails');
  let houses = await getCollectionData('houses');
  let final = [...apartments, ...villas, ...retails, ...houses];
  final = shuffleArray(final)
  return final;
}

function shuffleArray(array) {
  // Loop through the array from the last element to the first
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    // Swap the element at i with the element at randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array; // Return the shuffled array
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

export async function addToCollection(collectionName, documentData) {
  try {
    console.log(collectionName)
    const Collection = collection(db, collectionName);
    // Add a new document with a generated ID
    const docRef = await addDoc(Collection, documentData);

    console.log("Property added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding Property: ", error);
  }
}


export async function deleteFromCollection(collectionName, documentId) {
  try {
    // Reference to the document you want to delete
    const docRef = doc(db, collectionName, documentId);
    // Delete the document
    await deleteDoc(docRef);

    console.log("Property deleted with ID: ", documentId);
  } catch (error) {
    console.error("Error deleting Property: ", error);
  }
}


export const updateDocument = async (collectionName, docId, updateData) => {
  try {
    // Reference to the document
    const docRef = doc(db, collectionName, docId);

    // Update the document
    await updateDoc(docRef, updateData);

    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
    return 0
  }
};


export const regionOptionsAr = [
  { label: 'أكتوبر', value: { en: 'October', ar: 'أكتوبر' } },
  { label: 'زايد', value: { en: 'Zayed', ar: 'زايد' } },
  { label: 'التجمع الخامس', value: { en: 'The Fifth Settlement', ar: 'التجمع الخامس' } },
  { label: 'المستقبل سيتي', value: { en: 'Mostakbal City', ar: 'المستقبل سيتي' } },
  { label: 'العاصمة الإدارية', value: { en: 'New Capital', ar: 'العاصمة الإدارية' } },
  { label: 'مدينة الجلالة', value: { en: 'Galala City', ar: 'مدينة الجلالة' } },
  { label: 'السخنة', value: { en: 'Sokhna', ar: 'السخنة' } },
  { label: 'العلمين الجديدة', value: { en: 'New Alamein', ar: 'العلمين الجديدة' } },
  { label: 'الساحل', value: { en: 'North Coast', ar: 'الساحل' } },
  { label: 'الجونة', value: { en: 'Gouna', ar: 'الجونة' } },
];

export const regionOptionsEn = [
  { label: 'October', value: { en: 'October', ar: 'أكتوبر' } },
  { label: 'Zayed', value: { en: 'Zayed', ar: 'زايد' } },
  { label: 'The Fifth Settlement', value: { en: 'The Fifth Settlement', ar: 'التجمع' } },
  { label: 'Mostakbal City', value: { en: 'Mostakbal City', ar: 'المستقبل سيتي' } },
  { label: 'New Capital', value: { en: 'New Capital', ar: 'العاصمة الإدارية' } },
  { label: 'Galala City', value: { en: 'Galala City', ar: 'مدينة الجلالة' } },
  { label: 'Sokhna', value: { en: 'Sokhna', ar: 'السخنة' } },
  { label: 'New Alamein', value: { en: 'New Alamein', ar: 'العلمين الجديدة' } },
  { label: 'North Coast', value: { en: 'North Coast', ar: 'الساحل' } },
  { label: 'Gouna', value: { en: 'Gouna', ar: 'الجونة' } },
];

export const statusOptions = [
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
];
export const PaymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "Installment", value: "installment" },
];

export const rentOptions = [
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
];

export const apartmentTypes = [
  { label: "Standard", value: "Standard" },
  { label: "Duplex", value: "Duplex" },
  { label: "Penthouse", value: "Penthouse" },
  { label: "Studio", value: "Studio" },
];