// src/components/LoadingScreen.js
import React from "react";

const LoadingScreen = () => {
  return (
    // Main container
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white/80">
      
      {/* Spinner */}
      <div className="h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-blue-600"></div>

      {/* Text */}
      <p className="mt-5 text-xl text-gray-700">Loading...</p>

    </div>
  );
};

export default LoadingScreen;