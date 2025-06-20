import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAllContext } from "../../context/AllContext";
// 1. Import motion from framer-motion
import { motion } from "framer-motion";

const navLinksData = [
  { to: "/", labelEn: "Home", labelAr: "الرئيسية" },
  { to: "/browse", labelEn: "Browse", labelAr: "تصفح" },
  // You can easily add more links here
];

export default function NavLinks() {
  const { lang } = useAllContext();
  const location = useLocation();

  // 2. State to track the path of the link being hovered over.
  // This simplifies determining the bubble's true location.
  const [hoveredPath, setHoveredPath] = useState(null);

  // Determine the active path: prioritize the hovered link, otherwise use the current page's location.
  const activePath = hoveredPath || location.pathname;

  return (
    // 3. Enhanced container style for more depth.
    <ul
      onMouseLeave={() => setHoveredPath(null)} // Reset hover state when the mouse leaves the container
      className="hidden lg:flex relative items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-inner"
    >
      {navLinksData.map((link) => {
        const isTextActive = activePath === link.to;

        return (
          <li
            key={link.to}
            className="relative" // Each list item is relative to position the bubble inside it.
            onMouseEnter={() => setHoveredPath(link.to)} // Set the hover state on mouse enter
          >
            <NavLink
              to={link.to}
              className="relative z-10 flex items-center justify-center px-6 py-2 transition-colors duration-300"
            >
              {/* 4. Text color now driven by a single 'isTextActive' variable. */}
              <motion.span
                className="font-medium"
                animate={{ color: isTextActive ? "#FFFFFF" : "#475569" }} // Animate color change
                transition={{ duration: 0.3 }}
              >
                {lang === 'en' ? link.labelEn : link.labelAr}
              </motion.span>
            </NavLink>
            
            {/* 5. The bubble is now a motion.div rendered conditionally inside the active item. */}
            {/* The layoutId prop tells framer-motion to animate it between different list items. */}
            {isTextActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full -z-0"
                // 6. This is the magic! It identifies the element for smooth animation across the DOM.
                layoutId="sliding-bubble"
                // 7. A satisfying spring transition for a modern, fluid feel.
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}