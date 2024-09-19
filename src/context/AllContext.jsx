import { createContext, useContext, useState } from "react";


let AllContext = createContext();

export default function AllContextProvider({ children }) {
  let [isMenuOpen, setIsMenuOpen] = useState(false);
  let [lang, setLang] = useState('en')
  let [selectedProp, setSelectedProp] = useState(null)

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function toggleLang() {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }

  return (
    <AllContext.Provider
      value={{
        isMenuOpen,
        toggleMenu,
        lang,
        toggleLang,
        selectedProp,
        setSelectedProp
      }}
    >
      {children}
    </AllContext.Provider>
  );
}

export function useAllContext() {
  return useContext(AllContext);
}
