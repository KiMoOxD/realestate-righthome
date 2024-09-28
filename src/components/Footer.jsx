import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";


export default function Footer() {
  return (
    <div className="py-3 bg-slate-950/95 text-white">
      <div className="max-w-screen-2xl mx-auto flex justify-between px-5 items-center">
        <p className="text-xl">Right Home</p>
        <div className="flex gap-2 text-lg">
          <a href="https://m.facebook.com/profile.php?id=100064228025102&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-700">
            <FaFacebookF />
          </a>
          <a href="https://wa.me/message/YZH6GC3MBKPRI1" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-700">
            <FaWhatsapp />
          </a>
          <a href="https://www.instagram.com/right.homee?igsh=MTV3bGJ3ampyejA3YQ==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-700">
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
}
