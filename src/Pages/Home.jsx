import Hero from "../components/Hero";
import { PiBathtubLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { IoIosBed } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaDisease } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { useAllContext } from "../context/AllContext";
import { IoIosCall } from "react-icons/io";
import expIcon from "../images/experience.svg";

export default function Home() {
  let { lang } = useAllContext();
  return (
    <div>
      <Hero />
      <div className="flex flex-col items-center justify-center py-20 max-w-screen-2xl mx-auto">
        <p className="text-3xl font-semibold text-stone-800">
          {lang === "en" ? "Recommended for you" : "مـوصـي بـه لـك"}
        </p>
        <div className="flex flex-wrap justify-center px-4 gap-3 items-center my-5 *:transition text-sm">
          <button
            type="button"
            className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
          >
            {lang === "en" ? "View All" : "الـكـل"}
          </button>
          <button
            type="button"
            className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
          >
            {lang === "en" ? "Apartment" : "شـقـة"}
          </button>
          <button
            type="button"
            className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
          >
            {lang === "en" ? "Villa" : "فـيـلا"}
          </button>
          <button
            type="button"
            className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
          >
            {lang === "en" ? "Studio" : "ستوديو"}
          </button>
          <button
            type="button"
            className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
          >
            {lang === "en" ? "House" : "منزل"}
          </button>
          <button
            type="button"
            className="px-4 py-1 bg-stone-100 rounded-full hover:bg-blue-400 hover:text-white"
          >
            {lang === "en" ? "Office" : "مكتب"}
          </button>
        </div>

        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3">
          <div className="rounded-md overflow-hidden bg-stone-50/50 border group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Sale
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-blue-500 rounded-full z-20 text-xs text-white">
                <FaDisease /> North Cost
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://plus.unsplash.com/premium_photo-1677628418859-b21e4a5132cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="relative flex items-center justify-between py-3 px-5">
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-2xl text-green-600 peer/whatsapp" />
                <IoIosCall className="text-2xl text-stone-800 peer/whatsapp" />
              </div>
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border w-full group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Rent
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-slate-500 rounded-full z-20 text-xs text-white">
                <FaCity /> Cairo
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="relative flex items-center justify-between py-3 px-5">
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-2xl text-green-600 peer/whatsapp" />
                <IoIosCall className="text-2xl text-stone-800 peer/whatsapp" />
              </div>
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border w-full group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Sale
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-blue-500 rounded-full z-20 text-xs text-white">
                <FaDisease /> North Cost
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://plus.unsplash.com/premium_photo-1677628418859-b21e4a5132cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between py-3 px-5">
              <FaWhatsapp className="text-xl text-green-600" />
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border w-full group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Sale
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-blue-500 rounded-full z-20 text-xs text-white">
                <FaDisease /> North Cost
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://plus.unsplash.com/premium_photo-1677628418859-b21e4a5132cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between py-3 px-5">
              <FaWhatsapp className="text-xl text-green-600" />
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Sale
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-blue-500 rounded-full z-20 text-xs text-white">
                <FaDisease /> North Cost
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://plus.unsplash.com/premium_photo-1677628418859-b21e4a5132cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between py-3 px-5">
              <FaWhatsapp className="text-xl text-green-600" />
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border w-full group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Rent
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-slate-500 rounded-full z-20 text-xs text-white">
                <FaCity /> Cairo
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://plus.unsplash.com/premium_photo-1670315264879-59cc6b15db5f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between py-3 px-5">
              <FaWhatsapp className="text-xl text-green-600" />
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border w-full group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Sale
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-blue-500 rounded-full z-20 text-xs text-white">
                <FaDisease /> North Cost
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://plus.unsplash.com/premium_photo-1699533135101-124e59ed5565?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between py-3 px-5">
              <FaWhatsapp className="text-xl text-green-600" />
              <p>$750,000</p>
            </div>
          </div>

          <div className="rounded-md overflow-hidden bg-stone-50/50 border w-full group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <span className="absolute top-4 left-4 py-1 px-2 bg-stone-50 rounded-full z-20 text-xs">
                For Sale
              </span>
              <span className="absolute flex items-center gap-1 top-4 left-20 py-1 px-2 bg-blue-500 rounded-full z-20 text-xs text-white">
                <FaDisease /> North Cost
              </span>
              <div className="absolute top-0 left-0 h-full w-full bg-stone-800/40 z-10 transition opacity-0 group-hover:opacity-100"></div>
              <img
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[430px]"
                src="https://images.unsplash.com/photo-1472851342459-470a4dfa8a4b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="py-4 px-5">
              <p className="text-xl text-stone-800 font-semibold truncate">
                Casa Lomas De Machali
              </p>
              <div className="flex gap-2 items-center text-sm mt-2 text-stone-500">
                <span className="flex items-center gap-1">
                  <IoIosBed /> Beds: 2
                </span>
                <span className="flex items-center gap-1">
                  <PiBathtubLight /> Baths: 2
                </span>
                <span className="flex items-center gap-1">
                  <BiArea /> Area: 150m
                </span>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between py-3 px-5">
              <FaWhatsapp className="text-xl text-green-600" />
              <p>$750,000</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl mx-4 2xl:mx-auto overflow-hidden bg-blue-50 max-w-screen-2xl mb-10">
          <div className="overflow-hidden">
            <img
              className="min-w-[768px] h-full"
              src="https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="p-5 md:p-10">
            <p className="text-xs text-blue-600 font-semibold mb-2">
              OUR BENEFIT
            </p>
            <p className="text-3xl font-semibold text-stone-800 mb-4">
              Why to Choose RightHome
            </p>
            <p className="text-sm max-w-[500px] text-stone-500">
              Our Seasoned team excels in real estate with years of successful
              market navigation, offering informed decisions and optimal results
            </p>
            <div className="flex flex-col gap-2 mt-5">
              <div className="flex items-center gap-2 bg-white rounded-xl p-3">
                <img src={expIcon} alt="" className="w-12" />
                <div className="text-xs">
                  <p className="text-lg">Proven Expertise</p>
                  <p>
                    Our Seasoned team excels in real estate with years of
                    successful market navigation, offering informed decisions
                    and optimal results
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-3">
                <img src={expIcon} alt="" className="w-12" />
                <div className="text-xs">
                  <p className="text-lg">Proven Expertise</p>
                  <p>
                    Our Seasoned team excels in real estate with years of
                    successful market navigation, offering informed decisions
                    and optimal results
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-3">
                <img src={expIcon} alt="" className="w-12" />
                <div className="text-xs">
                  <p className="text-lg">Proven Expertise</p>
                  <p>
                    Our Seasoned team excels in real estate with years of
                    successful market navigation, offering informed decisions
                    and optimal results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
