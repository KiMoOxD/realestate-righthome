import { useState, useEffect, useLayoutEffect, useRef } from "react";

export default function InitialLoader() {
  // State to determine if the loader should be shown based on the session
  const [isSessionVisited] = useState(() => {
    // Check sessionStorage on initial render. Guard against SSR environments.
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('hasLoaderShown') === 'true';
    }
    return false;
  });

  // State hooks to control the splash screen's lifecycle (fade-out and unmount)
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(isSessionVisited); // Immediately unmount if session is visited
  
  // A ref to the <g> element that contains all the SVG paths to be animated
  const svgContainerRef = useRef(null);

  // This hook dynamically prepares each path for the drawing animation.
  // It runs only once after the component mounts.
  useLayoutEffect(() => {
    // If the loader is not going to be shown, don't prepare the SVG
    if (isSessionVisited) return;

    const svg = svgContainerRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll('.loader-path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });
  }, [isSessionVisited]);


  // This effect controls the lifecycle of the splash screen
  useEffect(() => {
    // If the session is already visited, do nothing.
    if (isSessionVisited) return;

    // --- FIX ---
    // Set the session flag immediately when the loader starts.
    // This prevents it from re-appearing on quick navigations or refreshes
    // before the animation has a chance to finish.
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasLoaderShown', 'true');
    }

    // Timer to start fading out after the main animation completes
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3200);

    // Timer to completely remove the component from the DOM
    const unmountTimer = setTimeout(() => {
      setIsUnmounted(true);
    }, 3700);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [isSessionVisited]); // This effect depends on whether the session was visited

  // If the component is unmounted (either from the start or after animation), render nothing.
  if (isUnmounted) {
    return null;
  }

  return (
    <>
      <style>{`
        /* --- Animation Keyframes --- */
        @keyframes loader-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes loader-fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fill-in { from { fill: transparent; } to { fill: url(#loader-gradient); } }
        @keyframes pop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }

        /* --- Element Styling & Animation Application --- */
        #LOADER_CONTAINER { animation: loader-fade-in 0.5s ease-out forwards; }
        #LOADER_CONTAINER.fade-out { animation: loader-fade-out 0.5s ease-out forwards; }
        .loader-path {
          animation: 
            draw 1.5s ease-in-out forwards,
            fill-in 0.5s ease-out forwards 2s;
          fill: transparent;
        }
        #LOADER_SVG {
          transform-origin: center center;
          animation: pop 0.5s ease-in-out forwards 2.6s;
        }

        /* Staggering delays */
        .loader-path:nth-child(2) { animation-delay: 0.05s, 2.05s; }
        .loader-path:nth-child(3) { animation-delay: 0.1s, 2.1s; }
        .loader-path:nth-child(4) { animation-delay: 0.15s, 2.15s; }
        .loader-path:nth-child(5) { animation-delay: 0.2s, 2.2s; }
        .loader-path:nth-child(6) { animation-delay: 0.25s, 2.25s; }
        .loader-path:nth-child(7) { animation-delay: 0.3s, 2.3s; }
      `}</style>
      
      <div
        id="LOADER_CONTAINER"
        className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 ${isFadingOut ? 'fade-out' : ''}`}
      >
        <svg
          id="LOADER_SVG"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-48 sm:w-64 sm:h-64" 
          viewBox="0 0 300.000000 300.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <g
            ref={svgContainerRef}
            transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
            stroke="url(#loader-gradient)" 
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* SVG paths remain unchanged */}
            <path className="loader-path" d="M1350 2177 c-69 -45 -184 -120 -255 -167 -72 -47 -134 -87 -138 -89 -5 -2 -6 22 -2 53 10 77 1 86 -89 86 -123 0 -116 9 -116 -144 l0 -131 -48 -30 c-26 -16 -87 -55 -135 -87 l-88 -58 -47 75 c-26 41 -49 74 -52 74 -3 0 -13 -6 -23 -13 -16 -13 -14 -19 39 -97 32 -46 61 -88 65 -93 4 -5 38 11 76 36 367 241 791 512 803 512 15 0 67 -33 575 -366 224 -147 303 -194 312 -186 22 18 15 32 -29 59 -120 74 -613 400 -615 407 -3 12 116 85 129 78 7 -3 193 -125 413 -270 220 -146 403 -266 407 -266 11 0 22 44 12 47 -5 2 -193 125 -419 274 -225 149 -414 273 -420 275 -5 2 -45 -21 -88 -51 -42 -30 -80 -55 -83 -55 -10 0 -143 84 -144 91 0 3 27 23 60 43 53 33 59 40 50 57 -6 10 -14 19 -18 18 -4 0 -63 -37 -132 -82z m-440 -226 l0 -60 -54 -35 c-29 -20 -56 -36 -60 -36 -3 0 -6 43 -6 95 l0 95 60 0 60 0 0 -59z" />
            <path className="loader-path" d="M60 1250 l0 -130 25 0 c23 0 25 3 25 50 0 43 3 50 20 50 14 0 27 -15 45 -50 22 -44 29 -50 56 -50 l31 0 -31 55 c-25 44 -29 57 -17 61 21 8 39 60 32 89 -9 35 -54 55 -126 55 l-60 0 0 -130z m124 74 c19 -18 19 -20 6 -45 -8 -13 -21 -19 -45 -19 -34 0 -35 1 -35 40 0 38 2 40 29 40 16 0 37 -7 45 -16z" />
            <path className="loader-path" d="M370 1250 l0 -130 30 0 30 0 0 130 0 130 -30 0 -30 0 0 -130z" />
            <path className="loader-path" d="M597 1359 c-56 -43 -59 -159 -5 -212 26 -27 34 -29 83 -25 73 6 85 18 85 84 l0 54 -50 0 c-43 0 -50 -3 -50 -20 0 -15 7 -20 26 -20 22 0 25 -4 22 -27 -2 -23 -8 -29 -35 -31 -42 -4 -63 26 -63 94 0 37 5 56 18 67 25 23 59 21 74 -3 15 -24 58 -27 58 -5 0 9 -11 27 -25 40 -32 33 -100 35 -138 4z" />
            <path className="loader-path" d="M890 1250 l0 -130 25 0 c24 0 25 3 25 55 l0 55 55 0 55 0 0 -55 c0 -52 1 -55 25 -55 l25 0 0 130 0 130 -27 0 c-27 0 -28 -1 -25 -54 l4 -53 -56 0 -56 0 0 53 c0 51 -1 54 -25 54 l-25 0 0 -130z" />
            <path className="loader-path" d="M1210 1360 c0 -17 7 -20 40 -20 l40 0 0 -110 0 -110 31 0 32 0 -5 110 -4 110 43 0 c36 0 43 3 43 20 0 19 -7 20 -110 20 -103 0 -110 -1 -110 -20z" />
            <path className="loader-path" d="M1710 1250 l0 -130 31 0 30 0 -6 55 -7 55 56 0 56 0 0 -55 c0 -52 1 -55 25 -55 l25 0 0 130 0 130 -25 0 c-24 0 -25 -3 -25 -54 l0 -54 -52 2 -53 2 3 52 c3 52 3 52 -28 52 l-30 0 0 -130z" />
            <path className="loader-path" d="M2087 1359 c-56 -43 -59 -156 -5 -209 43 -44 98 -42 144 4 31 31 34 40 34 91 0 61 -11 91 -44 117 -30 25 -97 23 -129 -3z m103 -34 c17 -21 24 -95 11 -127 -15 -39 -58 -48 -83 -18 -24 29 -25 116 -1 142 20 22 56 23 73 3z" />
            <path className="loader-path" d="M2380 1250 l0 -130 31 0 31 0 -7 95 c-4 52 -5 95 -2 95 3 0 11 -17 17 -37 60 -190 74 -197 120 -58 17 52 34 95 36 95 3 0 2 -43 -2 -95 l-7 -95 29 0 29 0 0 130 0 130 -36 0 -35 0 -29 -90 c-16 -49 -32 -90 -35 -90 -3 0 -19 41 -35 90 l-29 90 -38 0 -38 0 0 -130z" />
            <path className="loader-path" d="M2780 1250 l0 -130 90 0 c88 0 90 0 90 24 0 23 -2 24 -60 19 l-60 -6 0 39 0 39 50 -3 c49 -4 50 -3 50 23 0 27 -1 28 -50 22 l-50 -6 0 34 0 35 60 0 c53 0 60 2 60 20 0 19 -7 20 -90 20 l-90 0 0 -130z" />
            <path className="loader-path" d="M640 908 c-1 -2 -2 -29 -4 -60 -2 -45 0 -58 12 -58 10 0 12 7 8 25 -5 19 -2 25 9 25 8 0 21 -11 27 -25 6 -14 15 -25 20 -25 11 0 10 7 -2 30 -7 14 -7 25 2 39 16 26 -5 51 -43 51 -16 0 -29 -1 -29 -2z m60 -34 c0 -19 -28 -30 -42 -16 -6 6 -8 17 -5 26 7 18 47 10 47 -10z" />
            <path className="loader-path" d="M810 850 l0 -60 40 0 c22 0 40 5 40 10 0 6 -13 10 -30 10 -23 0 -30 5 -30 19 0 14 6 17 25 13 15 -2 25 0 25 7 0 6 -11 11 -25 11 -18 0 -25 5 -25 18 0 15 6 18 30 14 18 -3 30 0 30 7 0 6 -17 11 -40 11 l-40 0 0 -60z" />
            <path className="loader-path" d="M1001 888 c-5 -13 -16 -40 -24 -60 -14 -33 -14 -38 -1 -38 7 0 14 7 14 15 0 21 47 19 59 -2 20 -37 20 -4 -2 50 -24 62 -33 69 -46 35z" />
            <path className="loader-path" d="M1150 850 l0 -60 40 0 c22 0 40 5 40 10 0 6 -13 10 -30 10 -29 0 -30 1 -30 50 0 28 -4 50 -10 50 -6 0 -10 -27 -10 -60z" />
            <path className="loader-path" d="M1430 850 l0 -60 40 0 c22 0 40 5 40 10 0 6 -13 10 -30 10 -23 0 -30 5 -30 19 0 14 6 17 25 13 15 -2 25 0 25 7 0 6 -11 11 -25 11 -18 0 -25 5 -25 18 0 15 6 18 30 14 18 -3 30 0 30 7 0 6 -17 11 -40 11 l-40 0 0 -60z" />
            <path className="loader-path" d="M1603 903 c-26 -10 -14 -44 22 -59 41 -17 46 -34 10 -34 -14 0 -25 5 -25 10 0 6 -4 10 -10 10 -5 0 -10 -6 -10 -14 0 -26 59 -36 79 -12 16 20 4 43 -30 55 -30 10 -37 25 -18 36 5 4 18 0 28 -9 20 -18 36 -10 20 11 -11 13 -42 16 -66 6z" />
            <path className="loader-path" d="M1755 899 c4 -6 13 -8 21 -5 11 4 14 -7 14 -49 0 -30 5 -55 10 -55 6 0 10 23 10 50 0 43 3 50 20 50 11 0 20 5 20 10 0 6 -23 10 -51 10 -33 0 -48 -4 -44 -11z" />
            <path className="loader-path" d="M1961 888 c-5 -13 -16 -40 -24 -60 -14 -33 -14 -38 -1 -38 7 0 14 7 14 15 0 21 47 19 59 -2 20 -37 20 -4 -2 50 -24 62 -33 69 -46 35z" />
            <path className="loader-path" d="M2105 899 c4 -6 13 -8 21 -5 11 4 14 -7 14 -49 0 -30 5 -55 10 -55 6 0 10 24 10 54 0 49 2 54 20 49 11 -3 20 0 20 6 0 7 -20 11 -51 11 -33 0 -48 -4 -44 -11z" />
            <path className="loader-path" d="M2290 908 c-1 -2 -2 -29 -3 -60 l-2 -58 43 0 c26 0 41 4 37 10 -3 6 -20 10 -36 10 -24 0 -30 4 -27 18 2 11 11 16 25 14 12 -2 24 2 28 8 4 6 -6 10 -25 10 -25 0 -31 4 -28 18 2 12 11 16 30 14 14 -2 29 2 33 7 4 7 -8 11 -34 11 -23 0 -41 -1 -41 -2z" />
          </g>
        </svg>
      </div>
    </>
  );
}