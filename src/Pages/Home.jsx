import Hero from "../components/Hero";
import { useAllContext } from "../context/AllContext";
import expIcon from "../images/experience.svg";
import PropertyCard from "../components/PropertyCard";
import { useState, useEffect } from "react";
import { getApartments } from "../utils/data.js";
import SkeletonCard from "../components/SkeletonCard.jsx";
import TypesList from "../components/TypesList.jsx";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";

export default function Home() {
  let { lang } = useAllContext();
  const [apartments, setApartments] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        let apartmentsList = await getApartments();
        setApartments(apartmentsList);
      } catch (error) {
        console.error("Error fetching apartments: ", error);
      }
    };

    fetchApartments();
  }, []);
  return (
    <div>
      <Hero />
      <div className="flex flex-col items-center justify-center py-20 max-w-screen-2xl mx-auto">
        <p className="text-3xl font-semibold text-stone-800">
          {lang === "en" ? "Recommended for you" : "مـوصـي بـه لـك"}
        </p>
        <TypesList />
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3">
          {apartments.length > 0 ? (
            apartments.map((apartment) => (
              <PropertyCard key={apartment.id} property={apartment} />
            ))
          ) : (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </div>
        <Link
          to={"browse"}
          className="flex items-center gap-1 bg-blue-500 rounded-full text-white px-4 py-2 mt-6"
        >
          {lang === 'en' ? 'View All Properties' : 'عرض جميع الممتلكات'} <IoArrowForward />
        </Link>
      </div>
      <div className="lg:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:rounded-2xl lg:mx-4 2xl:mx-auto overflow-hidden bg-blue-50 max-w-screen-2xl mb-10">
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
            <p className="text-2xl md:text-3xl font-semibold text-stone-800 mb-4">
              Why to Choose Right Home
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
