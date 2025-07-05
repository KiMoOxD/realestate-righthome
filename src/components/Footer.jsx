import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi"; // A fitting icon for a real estate brand

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Reduced vertical padding for a much more compact feel */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Section 1: Branding (remains on the left) */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <GiHouseKeys className="text-3xl text-blue-400" />
            <span className="text-2xl font-bold text-white">Right Home</span>
          </a>

          {/* Section 2: Copyright (moves to the middle on larger screens) */}
          {/* The 'order-last' class makes it appear at the bottom on mobile, and 'sm:order-none' resets it for larger screens. */}
          <div className="text-sm text-gray-500 order-last sm:order-none">
            <p>&copy; {new Date().getFullYear()} Right Home. All Rights Reserved.</p>
          </div>

          {/* Section 3: Social Links (remain on the right) */}
          <div className="flex justify-center items-center gap-4">
            <a href="https://m.facebook.com/profile.php?id=100064228025102" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-300">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="https://wa.me/message/YZH6GC3MBKPRI1" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-full transition-all duration-300">
              <FaWhatsapp className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/right.homee?igsh=MTV3bGJ3ampyejA3YQ==" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-pink-600 rounded-full transition-all duration-300">
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}