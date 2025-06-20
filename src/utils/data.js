import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { db } from "../utils/firebase.js"; // Import your Firebase setup

export async function getCollectionData(collectionName) {
  if (collectionName === 'all') {
    let allData = await getAllCollectionsData();
    return allData
  }
  
  const apartmentsCollection = collection(db, collectionName);
  const apartmentsSnapshot = await getDocs(apartmentsCollection);
  const apartmentsList = apartmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return apartmentsList;
}

export async function getAllCollectionsData() {
  // This function is unchanged and correctly excludes the 'archived' collection.
  let apartments = await getCollectionData('apartments');
  let villas = await getCollectionData('villas');
  let retails = await getCollectionData('retails');
  let houses = await getCollectionData('houses');
  let final = [...apartments, ...villas, ...retails, ...houses];
  final = shuffleArray(final)
  return final;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export async function getDocumentData(collection, id) {
  try {
    const docRef = doc(db, collection, id);
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
    const Collection = collection(db, collectionName);
    const docRef = await addDoc(Collection, documentData);
    console.log("Property added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding Property: ", error);
  }
}

export async function deleteFromCollection(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    console.log("Property deleted with ID: ", documentId);
  } catch (error) {
    console.error("Error deleting Property: ", error);
  }
}

export const updateDocument = async (collectionName, docId, updateData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateData);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
    return 0
  }
};

// --- NEW FUNCTIONS ---

/**
 * Moves a document from its original collection to the 'archived' collection.
 * @param {string} originalCollectionName - The name of the collection where the document currently resides.
 * @param {string} docId - The ID of the document to archive.
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function archiveDocument(originalCollectionName, docId) {
    try {
        const docRef = doc(db, originalCollectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            const archivedCollectionRef = collection(db, 'archived');
            await addDoc(archivedCollectionRef, docData);
            await deleteDoc(docRef);
            console.log(`Document ${docId} moved from ${originalCollectionName} to archived.`);
            return { success: true };
        } else {
            throw new Error("Document not found in the original collection.");
        }
    } catch (error) {
        console.error("Error archiving document: ", error);
        return { success: false, error };
    }
}

/**
 * Moves a document from the 'archived' collection back to its active collection.
 * @param {string} archivedDocId - The ID of the document in the 'archived' collection.
 * @param {object} propertyData - The full data of the property, including its 'category'.
 * @returns {Promise<{success: boolean, newDocId?: string, error?: any}>}
 */
export async function publishDocument(archivedDocId, propertyData) {
    try {
        if (!propertyData.category) {
            throw new Error("Property data must include a category to determine the target collection.");
        }
        const targetCollectionName = `${propertyData.category}s`;
        
        const targetCollectionRef = collection(db, targetCollectionName);
        const newDocRef = await addDoc(targetCollectionRef, propertyData);
        
        const archivedDocRef = doc(db, 'archived', archivedDocId);
        await deleteDoc(archivedDocRef);
        
        console.log(`Document ${archivedDocId} published to ${targetCollectionName} as ${newDocRef.id}`);
        return { success: true, newDocId: newDocRef.id };
    } catch (error) {
        console.error("Error publishing document: ", error);
        return { success: false, error };
    }
}

/**
 * Fetches all documents from the 'archived' collection.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of archived properties.
 */
export async function getArchivedCollectionData() {
    const archivedCollectionRef = collection(db, 'archived');
    const snapshot = await getDocs(archivedCollectionRef);
    const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return list;
}


// --- EXPORTED DATA ---

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
  { label: "Chalet", value: "Chalet" },
  { label: "Cabin", value: "Cabin" },
];
