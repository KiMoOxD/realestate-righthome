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
  let offices = await getCollectionData('offices');
  let studios = await getCollectionData('studios');
  let houses = await getCollectionData('houses');
  let final = [...apartments, ...villas, ...offices, ...studios, ...houses];
  return final;
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
  }
};
