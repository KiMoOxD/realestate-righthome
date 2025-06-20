import { useState, useRef, useLayoutEffect } from "react";
import { useAllContext } from "../context/AllContext";

const buttonTypes = [
  { id: "all", labelEn: "View All", labelAr: "الـكـل" },
  { id: "apartments", labelEn: "Apartment", labelAr: "شـقـة" },
  { id: "villas", labelEn: "Villa", labelAr: "فـيـلا" },
  { id: "retails", labelEn: "Retail", labelAr: "تجاري" },
  { id: "houses", labelEn: "House", labelAr: "منزل" },
];

export default function TypesList({ setCollectionType }) {
  const { lang } = useAllContext();
  const [isSelected, setIsSelected] = useState("all");
  const [sliderStyle, setSliderStyle] = useState({});
  const buttonsContainerRef = useRef(null);

  // This effect now only runs for the desktop slider animation.
  useLayoutEffect(() => {
    //
    const container = buttonsContainerRef.current;
    if (!container) return;

    // We only need to measure and position the slider on non-mobile screens
    if (window.innerWidth < 768) { // 768px is the default for Tailwind's 'md' breakpoint
        setSliderStyle({ width: 0, opacity: 0 }); // Hide slider on mobile
        return;
    }

    const activeButton = container.querySelector(`[data-id='${isSelected}']`);
    if (activeButton) {
        setSliderStyle({
            opacity: 1,
            width: activeButton.offsetWidth,
            left: activeButton.offsetLeft,
        });
    }

    const resizeObserver = new ResizeObserver(() => {
        const activeBtn = container.querySelector(`[data-id='${isSelected}']`);
        if (activeBtn) {
            setSliderStyle({
                opacity: 1,
                width: activeBtn.offsetWidth,
                left: activeBtn.offsetLeft,
            });
        }
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [isSelected, lang]);

  function handleClick(id) {
    setCollectionType(id);
    setIsSelected(id);
  }

  return (
    <div
      ref={buttonsContainerRef}
      // --- RESPONSIVE CONTAINER ---
      // Mobile: A wrapping flexbox with gaps.
      // Desktop (md+): Becomes a single-line "pill" with a background.
      className="relative flex flex-wrap justify-center items-center gap-3 my-8
                 md:flex-nowrap md:bg-slate-100 md:rounded-full md:p-1"
    >
      
      {/* --- SLIDING INDICATOR --- */}
      {/* This is now hidden on mobile and appears on desktop screens */}
      <div
        className="hidden md:block absolute h-[85%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-md transition-all duration-300 ease-in-out"
        style={{ ...sliderStyle, top: '50%', transform: 'translateY(-50%)' }}
      />

      {buttonTypes.map((type) => {
        const isActive = isSelected === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => handleClick(type.id)}
            data-id={type.id}
            // --- RESPONSIVE BUTTON STYLES ---
            className={`z-10 px-5 py-2 rounded-full font-medium transition-all duration-300 outline-none focus:outline-none flex-shrink-0
              ${isActive
                // Active State: Blue background on mobile, transparent with white text on desktop
                ? 'bg-blue-500 text-white shadow md:bg-transparent md:shadow-none'
                // Inactive State: White background on mobile, transparent with gray text on desktop
                : 'bg-white text-gray-700 shadow-sm md:bg-transparent md:shadow-none md:text-gray-600 md:hover:text-gray-900'
              }`
            }
          >
            {lang === "en" ? type.labelEn : type.labelAr}
          </button>
        );
      })}
    </div>
  );
}