import { useEffect, useState } from "react";
import { getCollectionData } from "../utils/data";
import Section from "../components/Browse/Section";
export default function BrowsePage() {
  let [properties, setProperties] = useState({
    villas: { rent: [], sale: [] },
    apartments: { rent: [], sale: [] },
    offices: { rent: [], sale: [] },
    studios: { rent: [], sale: [] },
    houses: { rent: [], sale: [] },
  });
  useEffect(() => {
    async function getData() {
      let villasData = await getCollectionData("villas");
      let apartmentsData = await getCollectionData("apartments");
      let officesData = await getCollectionData("offices");
      let studiosData = await getCollectionData("studios");
      let housesData = await getCollectionData("houses");

      setProperties({
        villas: {
          rent: villasData.filter((villa) => villa.status === "rent"),
          sale: villasData.filter((villa) => villa.status === "sale"),
        },
        apartments: {
          rent: apartmentsData.filter(
            (apartment) => apartment.status === "rent"
          ),
          sale: apartmentsData.filter(
            (apartment) => apartment.status === "rent"
          ),
        },
        offices: {
          rent: officesData.filter((office) => office.status === "rent"),
          sale: officesData.filter((office) => office.status === "sale"),
        },
        studios: {
          rent: studiosData.filter((studio) => studio.status === "rent"),
          sale: studiosData.filter((studio) => studio.status === "sale"),
        },
        houses: {
          rent: housesData.filter((house) => house.status === "rent"),
          sale: housesData.filter((house) => house.status === "sale"),
        },
      });
    }
    getData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-114px)] max-w-screen-2xl px-4 pb-5 mx-auto">
      <Section
        title={{ en: "Villas", ar: "فـيـلا" }}
        subtitle={{
          sale: { en: "Villas For Sale", ar: "فلل للبيع" },
          rent: { en: "Villas For Rent", ar: "فلل للايجار" },
        }}
        saleList={properties.villas.sale}
        rentList={properties.villas.rent}
      />

      <Section
        title={{ en: "Apartments", ar: "شقق" }}
        subtitle={{
          sale: { en: "Apartments For Sale", ar: "شقق للبيع" },
          rent: { en: "Apartments For Rent", ar: "شقق للايجار" },
        }}
        saleList={properties.apartments.sale}
        rentList={properties.apartments.rent}
      />

      <Section
        title={{ en: "Offices", ar: "مكاتب" }}
        subtitle={{
          sale: { en: "Offices For Sale", ar: "مكاتب للبيع" },
          rent: { en: "Offices For Rent", ar: "مكاتب للايجار" },
        }}
        saleList={properties.offices.sale}
        rentList={properties.offices.rent}
      />

      <Section
        title={{ en: "Studios", ar: "استوديوهات" }}
        subtitle={{
          sale: { en: "Studios For Sale", ar: "استوديوهات للبيع" },
          rent: { en: "Studios For Rent", ar: "استوديوهات للايجار" },
        }}
        saleList={properties.studios.sale}
        rentList={properties.studios.rent}
      />

      <Section
        title={{ en: "Houses", ar: "بيوت" }}
        subtitle={{
          sale: { en: "Houses For Sale", ar: "بيوت للبيع" },
          rent: { en: "Houses For Rent", ar: "بيوت للايجار" },
        }}
        saleList={properties.houses.sale}
        rentList={properties.houses.rent}
      />
    </div>
  );
}
