import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAllContext } from '../../context/AllContext';

// --- ICONS & UTILS (No changes) ---
import { IoIosBed } from "react-icons/io";
import { PiBathtubLight, PiBuildingsLight } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { HiShieldCheck, HiOutlineDocumentText } from "react-icons/hi2";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { formattedPriceEn, formattedPriceAR } from "../../utils/functions";

// --- Centralized Translations Object (No changes) ---
const translations = {
    en: {
        forSale: 'FOR SALE',
        verified: 'Verified',
        by: 'By',
        price: 'Price',
        cash: 'Cash',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        area: 'Area',
        floor: 'Floor',
        aboutTitle: 'About this property',
        descriptionTitle: 'Description',
        locationTitle: 'Location',
        noDescription: 'No description available.',
        noAbout: 'No additional details available.',
        noLocation: 'Location information is not available.',
        contactForPrice: 'Contact Us',
        currency: 'EGP',
        locationLinkAvailable: 'A link to the location is available.',
        openInMaps: 'Open in Google Maps',
    },
    ar: {
        forSale: 'للبيع',
        verified: 'موثقة',
        by: 'بواسطة',
        price: 'السعر',
        cash: 'كاش',
        bedrooms: 'غرف نوم',
        bathrooms: 'حمامات',
        area: 'المساحة',
        floor: 'الدور',
        aboutTitle: 'عن هذا العقار',
        descriptionTitle: 'الوصف',
        locationTitle: 'الموقع',
        noDescription: 'لا يتوفر وصف.',
        noAbout: 'لا تتوفر تفاصيل إضافية.',
        noLocation: 'معلومات الموقع غير متاحة.',
        contactForPrice: 'تواصل معنا',
        currency: 'جنيه',
        locationLinkAvailable: 'رابط الموقع متاح.',
        openInMaps: 'افتح في خرائط جوجل',
    }
};


// --- HELPER COMPONENTS (KeyFact & DetailsSection are unchanged) ---

const KeyFact = React.memo(({ icon, value, label }) => (
    <div className="flex gap-3 items-center rtl:flex-row-reverse">
        <div className="text-3xl text-sky-600">{icon}</div>
        <div className="rtl:text-right">
            <p className="text-base font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
));

const DetailsSection = React.memo(({ title, icon, children }) => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 rtl:flex-row">
            <span className="text-sky-600 text-xl">{icon}</span>
            <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        </div>
        <div className="p-4 sm:p-6">
            {children}
        </div>
    </div>
));

// --- OPTIMIZED PRICE DISPLAY COMPONENT ---
const PriceDisplay = React.memo(({ property, t, lang }) => (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col ltr:justify-start rtl:justify-end">
        <p className="text-sm text-slate-500">{t.price}</p>
        
        {/* The 'rtl:flex-row-reverse' was removed here as it's not needed for currency formatting */}
        <div className="flex items-baseline gap-3 mt-1">
            <p className="text-4xl font-extrabold text-sky-700">
                {!isNaN(property.price) 
                    ? (lang === 'en' ? formattedPriceEn.format(property.price).replace('$', '') : formattedPriceAR.format(property.price)) 
                    : t.contactForPrice
                }
            </p>
            {!isNaN(property.price) && <span className="text-xl font-semibold text-slate-700">{t.currency}</span>}
        </div>
        <div className="flex items-center gap-2 mt-2">
            <div className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">{t.cash}</div>
        </div>
    </div>
));


// --- MAIN COMPONENT (No other changes needed) ---
export default function PropertyInfo({ property }) {
    const { lang } = useAllContext();
    const t = translations[lang];

    const getMapSrc = (iframeString) => {
        if (!iframeString) return null;
        const match = iframeString.match(/src="([^"]*)"/);
        return match ? match[1] : null;
    };

    const mapEmbedSrc = useMemo(() => getMapSrc(property.propertyLocation), [property.propertyLocation]);
    
    const categoryDisplay = useMemo(() => {
        const category = property.category?.toUpperCase();
        const typeMap = {
            APARTMENT: property.apartmentType,
            RETAIL: property.retailType,
            VILLA: property.villaType,
        };
        const type = typeMap[category];
        return type ? `${category} (${type.toUpperCase()})` : category;
    }, [property.category, property.apartmentType, property.retailType, property.villaType]);

    const textClassName = `text-base leading-relaxed text-slate-700 whitespace-pre-wrap font-sans rtl:text-right ${lang === 'ar' ? 'arabic' : ''}`;

    return (
        <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header>
                <div className="flex flex-wrap items-center gap-2 mb-3 rtl:justify-end">
                    <div className="bg-sky-100 text-sky-800 text-xs font-semibold px-3 py-1.5 rounded-full">{categoryDisplay}</div>
                    <div className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">{t.forSale}</div>
                    <div className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full"><HiShieldCheck />{t.verified}</div>
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold text-slate-900 rtl:text-right ${lang === 'ar' ? 'arabic' : ''}`}>
                    {lang === 'en' ? property.title.en : property.title.ar}
                </h1>
                {property.developer && (
                    <p className={`text-sm mt-1 text-slate-600 rtl:text-right`}>
                        {t.by}: <span className="font-semibold text-sky-700">{property.developer}</span>
                    </p>
                )}
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                <KeyFact icon={<IoIosBed />} value={property.beds || '-'} label={t.bedrooms} />
                <KeyFact icon={<PiBathtubLight />} value={property.baths || '-'} label={t.bathrooms} />
                <KeyFact icon={<BiArea />} value={`${property.area || '-'} m²`} label={t.area} />
                <KeyFact icon={<PiBuildingsLight />} value={property.floor || '-'} label={t.floor} />
            </div>

            <PriceDisplay property={property} t={t} lang={lang} />
            
            <div className="flex flex-col gap-6">
                <DetailsSection title={t.aboutTitle} icon={<FaRegBuilding />}>
                    <p className={`${textClassName} min-h-[44px]`}>
                        {lang === "en" ? property.about?.en : property.about?.ar || t.noAbout}
                    </p>
                </DetailsSection>
                
                <DetailsSection title={t.descriptionTitle} icon={<HiOutlineDocumentText />}>
                    <p className={textClassName}>
                        {lang === 'en' ? property.description.en : property.description.ar || t.noDescription}
                    </p>
                </DetailsSection>

                <DetailsSection title={t.locationTitle} icon={<MdOutlineLocationOn />}>
                    {mapEmbedSrc ? (
                        <iframe
                            src={mapEmbedSrc}
                            width="100%"
                            height="350"
                            className="rounded-lg shadow-md"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Property Location"
                        ></iframe>
                    ) : property.propertyLocation ? (
                         <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg p-8 text-center">
                            <MdOutlineLocationOn className="text-5xl text-sky-500 mb-4" />
                            <p className="text-slate-600 mb-4">{t.locationLinkAvailable}</p>
                            <a
                                href={property.propertyLocation}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-sky-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-md"
                            >
                                {t.openInMaps}
                            </a>
                        </div>
                    ) : (
                        <p className="text-slate-500">{t.noLocation}</p>
                    )}
                </DetailsSection>
            </div>
        </motion.div>
    );
}