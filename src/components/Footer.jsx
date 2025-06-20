import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi"; // A fitting icon for a real estate brand

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          
          {/* Section 1: Branding and Mission */}
          <div className="text-center md:text-left md:w-1/2 lg:w-1/3">
            <a href="/" className="flex items-center justify-center md:justify-start gap-2">
              <GiHouseKeys className="text-3xl text-blue-400" />
              <span className="text-2xl font-bold text-white">Right Home</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Your key to finding the perfect property. We bridge the gap between your dream home and reality with comfort, elegance, and dedication.
            </p>
          </div>

          {/* Section 2: Follow Us */}
          <div className="text-center md:text-right">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-200">
              Follow Our Journey
            </h3>
            <div className="flex justify-center md:justify-end gap-4 mt-4">
              <a href="https://m.facebook.com/profile.php?id=100064228025102" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-800 hover:bg-blue-600 hover:scale-110 transform transition-all duration-300">
                <FaFacebookF />
              </a>
              <a href="https://wa.me/message/YZH6GC3MBKPRI1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-800 hover:bg-green-500 hover:scale-110 transform transition-all duration-300">
                <FaWhatsapp />
              </a>
              <a href="https://www.instagram.com/right.homee?igsh=MTV3bGJ3ampyejA3YQ==" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-800 hover:bg-pink-600 hover:scale-110 transform transition-all duration-300">
                <FaInstagram />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Right Home. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}