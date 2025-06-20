import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {auth} from "../utils/firebase";


let AllContext = createContext();

export default function AllContextProvider({ children }) {
  let [isMenuOpen, setIsMenuOpen] = useState(false);
  let [lang, setLang] = useState('en')
  let [selectedProp, setSelectedProp] = useState(null)
  let [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    // This line is crucial for Tailwind's rtl/ltr variants to work
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function toggleLang() {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }

    const login = async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return userCredential;
        } catch (error) {
          console.error("Error Sign In:", error);
          // Re-throw the error so the calling component can catch it
          throw error;
        }
      };

  const logout = () => {
    window.location.reload();
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
      setCurrentUser(null);
    };
  }, []);

  return (
    <AllContext.Provider
      value={{
        isMenuOpen,
        toggleMenu,
        lang,
        toggleLang,
        selectedProp,
        setSelectedProp,
        login,
        logout,
        resetPassword,
        currentUser
      }}
    >
      {children}
    </AllContext.Provider>
  );
}

export function useAllContext() {
  return useContext(AllContext);
}
