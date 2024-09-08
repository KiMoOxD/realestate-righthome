import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBq9QAYhJFFtNRWnStkmgWpOK8U3kBtFuc",
//   authDomain: "realestate-7a71c.firebaseapp.com",
//   projectId: "realestate-7a71c",
//   storageBucket: "realestate-7a71c.appspot.com",
//   messagingSenderId: "389607222188",
//   appId: "1:389607222188:web:cb07f07fb48449527de809"
// };

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyqjF8jK40URk-p4Z55XNHOMtasOpJ-Aw",
  authDomain: "realestate-righthome.firebaseapp.com",
  projectId: "realestate-righthome",
  storageBucket: "realestate-righthome.appspot.com",
  messagingSenderId: "788122687613",
  appId: "1:788122687613:web:ed7ee3dc63af37fd26b914"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

