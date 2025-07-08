// utils/data.js

import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import {
  db
} from "../utils/firebase.js";

// --- Data exports moved to the top for use in the new translation function ---
export const regionOptionsEn = [{ label: 'October', value: { en: 'October', ar: 'أكتوبر' } }, { label: 'Zayed', value: { en: 'Zayed', ar: 'زايد' } }, { label: 'The Fifth Settlement', value: { en: 'The Fifth Settlement', ar: 'التجمع الخامس' } }, { label: 'Mostakbal City', value: { en: 'Mostakbal City', ar: 'المستقبل سيتي' } }, { label: 'New Capital', value: { en: 'New Capital', ar: 'العاصمة الإدارية' } }, { label: 'Galala City', value: { en: 'Galala City', ar: 'مدينة الجلالة' } }, { label: 'Sokhna', value: { en: 'Sokhna', ar: 'السخنة' } }, { label: 'New Alamein', value: { en: 'New Alamein', ar: 'العلمين الجديدة' } }, { label: 'North Coast', value: { en: 'North Coast', ar: 'الساحل' } }, { label: 'Gouna', value: { en: 'Gouna', ar: 'الجونة' } }, ];
export const regionOptionsAr = [{ label: 'أكتوبر', value: { en: 'October', ar: 'أكتوبر' } }, { label: 'زايد', value: { en: 'Zayed', ar: 'زايد' } }, { label: 'التجمع الخامس', value: { en: 'The Fifth Settlement', ar: 'التجمع الخامس' } }, { label: 'المستقبل سيتي', value: { en: 'Mostakbal City', ar: 'المستقبل سيتي' } }, { label: 'العاصمة الإدارية', value: { en: 'New Capital', ar: 'العاصمة الإدارية' } }, { label: 'مدينة الجلالة', value: { en: 'Galala City', ar: 'مدينة الجلالة' } }, { label: 'السخنة', value: { en: 'Sokhna', ar: 'السخنة' } }, { label: 'العلمين الجديدة', value: { en: 'New Alamein', ar: 'العلمين الجديدة' } }, { label: 'الساحل', value: { en: 'North Coast', ar: 'الساحل' } }, { label: 'الجونة', value: { en: 'Gouna', ar: 'الجونة' } }, ];

// ** NEW: Translation logic **
// Create a lookup map for efficient translation from Arabic/English variations to canonical English.
const regionTranslationMap = {};
regionOptionsEn.forEach(option => {
    const canonicalEnglish = option.value.en;
    // Map the English label (e.g., "north coast")
    regionTranslationMap[option.label.toLowerCase()] = canonicalEnglish;
    // Map the Arabic label (e.g., "الساحل")
    regionTranslationMap[option.value.ar.toLowerCase()] = canonicalEnglish;
});
// Add common synonyms or variations the AI might produce.
regionTranslationMap["الساحل الشمالي"] = "North Coast";

/**
 * **NEW**: Translates an array of region names (Arabic or English) to their canonical English counterparts.
 * @param {Array<string>} regionNames - An array of region names from the AI.
 * @returns {Array<string>} - A new array containing the translated English names.
 */
export function translateRegionsToEnglish(regionNames) {
    if (!Array.isArray(regionNames)) return [];
    
    const uniqueRegions = new Set(regionNames
        .map(name => regionTranslationMap[String(name).toLowerCase().trim()])
        .filter(Boolean) // Filter out any names that couldn't be mapped
    );
    
    return Array.from(uniqueRegions);
}

// --- Existing Functions ---

export async function getCollectionData(collectionName) {
  if (collectionName === 'all') {
    let allData = await getAllCollectionsData();
    return allData
  }
  const apartmentsCollection = collection(db, collectionName);
  const apartmentsSnapshot = await getDocs(apartmentsCollection);
  const apartmentsList = apartmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    cName: collectionName,
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
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export function filterProperties(properties, filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return properties;
  }
  console.log("properties", properties)
  console.log("filters", filters)
  return properties.filter(property => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const propertyValue = property[key];
      if (filterValue === undefined || filterValue === null) {
        return true;
      }
      if (key === 'region') {
        if (!propertyValue || !propertyValue.en) return false;
        const propertyRegion = propertyValue.en.toLowerCase();
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.some(r => r.toLowerCase() === propertyRegion);
        }
        return true;
      }
      if (key === 'category') {
        if (!propertyValue) return false;
        const propertyCategory = String(propertyValue).toLowerCase();
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.some(c => c.toLowerCase() === propertyCategory);
        }
        return true;
      }
      if (key === 'status') {
        if (!propertyValue) return false;
        const propertyStatus = String(propertyValue).toLowerCase();
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.some(s => s.toLowerCase() === propertyStatus);
        }
        return true;
      }
      if (key === 'minPrice') {
        return property.price >= filterValue;
      }
      if (key === 'maxPrice') {
        return property.price <= filterValue;
      }
      return String(propertyValue).toLowerCase() === String(filterValue).toLowerCase();
    });
  });
}

// ... the rest of your functions (getDocumentData, etc.) remain unchanged ...
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
      return {
        success: true
      };
    } else {
      throw new Error("Document not found in the original collection.");
    }
  } catch (error) {
    console.error("Error archiving document: ", error);
    return {
      success: false,
      error
    };
  }
}

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
    return {
      success: true,
      newDocId: newDocRef.id
    };
  } catch (error) {
    console.error("Error publishing document: ", error);
    return {
      success: false,
      error
    };
  }
}

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
export const statusOptions = [{
  label: "For Sale",
  value: "sale"
}, {
  label: "For Rent",
  value: "rent"
}, ];
export const PaymentOptions = [{
  label: "Cash",
  value: "cash"
}, {
  label: "Installment",
  value: "installment"
}, ];
export const rentOptions = [{
  label: "Daily",
  value: "daily"
}, {
  label: "Monthly",
  value: "monthly"
}, ];
export const apartmentTypes = [{
  label: "Standard",
  value: "Standard"
}, {
  label: "Duplex",
  value: "Duplex"
}, {
  label: "Penthouse",
  value: "Penthouse"
}, {
  label: "Studio",
  value: "Studio"
}, {
  label: "Chalet",
  value: "Chalet"
}, {
  label: "Cabin",
  value: "Cabin"
}, ];