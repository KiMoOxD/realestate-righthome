import Hero from "../components/Hero";
import { useAllContext } from "../context/AllContext";
import expIcon from "../images/experience.svg";
import PropertyCard from "../components/PropertyCard";
import { useState, useEffect } from "react";
import { getCollectionData } from "../utils/data.js";
import SkeletonCard from "../components/SkeletonCard.jsx";
import TypesList from "../components/TypesList.jsx";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";


export default function Home() {
  let { lang } = useAllContext();
  const [apartments, setApartments] = useState([]);
  let [collectionType, setCollectionType] = useState('apartments')

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        let propertiesData = await getCollectionData(collectionType);
            propertiesData = propertiesData.slice(0, 6)
        setApartments(propertiesData);
      } catch (error) {
        console.error("Error fetching apartments: ", error);
      }
    };
    fetchApartments();
  }, [collectionType]);

  return (
    <div>
      <Hero />
      <div className="flex flex-col items-center justify-center py-10 max-w-screen-xl mx-auto">
        <p className="text-md font-semibold text-blue-500 arabic-bold mx-auto mt-10">
          {lang === "en" ? 'Featured Properties' : 'عقارات مميزة'}
        </p>
        <p className="text-3xl font-semibold text-stone-800">
          {lang === "en" ? "Recommended for you" : "مـوصـي بـه لـك"}
        </p>
        <TypesList setCollectionType={setCollectionType} />
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-3">
          {apartments.length > 0 ? (
            apartments.map((apartment) => (
              <PropertyCard key={apartment.id} property={apartment} />
            ))
          ) : (
            <>
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
          <div className="overflow-hidden max-h-[600px]">
            <img
              className="min-w-[768px] h-full"
              src="https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=2108&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="p-5 md:p-10 flex flex-col justify-center">
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

      <div className="flex flex-col gap-2 items-center">
        <p className="text-md font-semibold text-blue-500 arabic-bold mt-10">
          {lang === "en" ? 'Our Team' : 'فريقنا'}
        </p>
        <p className="text-3xl font-semibold text-stone-800">
          {lang === "en" ? "Meet Our Agents" : "تعرف على وكلائنا"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-6">
          <div className="p-2 cursor-pointer">
            <img src="https://campaignagent.com.au/UAT/wp-content/uploads/2021/12/Ca-Agent.jpg" alt="" className="rounded-2xl w-[300px]"/>
            <div className="mt-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">Kareem Mohammed</p>
                <p className="text-xs text-stone-500">Adminstritive Staff</p>
              </div>
              <div>
                <IoIosCall className="text-xl border text-stone-400 rounded-full size-9 p-2"/>
              </div>
            </div>
          </div>
          <div className="p-2 cursor-pointer">
            <img src="https://campaignagent.com.au/UAT/wp-content/uploads/2021/12/Ca-Agent.jpg" alt="" className="rounded-2xl w-[300px]"/>
            <div className="mt-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">Kareem Mohammed</p>
                <p className="text-xs text-stone-500">Adminstritive Staff</p>
              </div>
              <div>
                <IoIosCall className="text-xl border text-stone-400 rounded-full size-9 p-2"/>
              </div>
            </div>
          </div>
          <div className="p-2 cursor-pointer">
            <img src="https://campaignagent.com.au/UAT/wp-content/uploads/2021/12/Ca-Agent.jpg" alt="" className="rounded-2xl w-[300px]"/>
            <div className="mt-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">Kareem Mohammed</p>
                <p className="text-xs text-stone-500">Adminstritive Staff</p>
              </div>
              <div>
                <IoIosCall className="text-xl border text-stone-400 rounded-full size-9 p-2"/>
              </div>
            </div>
          </div>
          <div className="p-2 cursor-pointer">
            <img src="https://campaignagent.com.au/UAT/wp-content/uploads/2021/12/Ca-Agent.jpg" alt="" className="rounded-2xl w-[300px]"/>
            <div className="mt-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">Kareem Mohammed</p>
                <p className="text-xs text-stone-500">Adminstritive Staff</p>
              </div>
              <div>
                <IoIosCall className="text-xl border text-stone-400 rounded-full size-9 p-2"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
