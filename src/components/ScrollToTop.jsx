import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAllContext } from "../context/AllContext";


const ScrollToTop = () => {
  const { pathname } = useLocation();
  let { isMenuOpen, toggleMenu } = useAllContext();


  useEffect(() => {
    if (isMenuOpen) toggleMenu();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [pathname]);

  return null;
};

export default ScrollToTop;
