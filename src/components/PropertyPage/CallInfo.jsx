import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAllContext } from "../../context/AllContext";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoCallOutline, IoMailOutline, IoPersonOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { addToCollection } from "../../utils/data"; // Import the Firestore function

// --- Centralized Translations Object ---
const translations = {
    en: {
        title: "Interested? Get in Touch",
        subtitle: "Fill out the form below and we will get back to you.",
        namePlaceholder: "Your Name",
        emailPlaceholder: "Your Email",
        phonePlaceholder: "Your Phone Number",
        messagePlaceholder: "Your Message...",
        submitBtn: "Send Message",
        submittingBtn: "Sending...",
        or: "OR",
        whatsAppBtn: "Chat on WhatsApp",
        revealPhoneBtn: "Reveal Phone Number",
        formSuccess: "Message sent successfully!",
        formError: "Failed to send message. Please try again.",
        whatsAppMessage: (property, path) => `
Hello,
I'm interested in this property:
Type: ${property.category}
Location: ${property.region.en}
Link: https://www.righthome.homes${path}
Could you please provide more information?
        `
    },
    ar: {
        title: "مهتم؟ تواصل معنا",
        subtitle: "املأ النموذج أدناه وسنعاود الاتصال بك.",
        namePlaceholder: "اسمك",
        emailPlaceholder: "بريدك الإلكتروني",
        phonePlaceholder: "رقم هاتفك",
        messagePlaceholder: "رسالتك...",
        submitBtn: "إرسال الرسالة",
        submittingBtn: "جار الإرسال...",
        or: "أو",
        whatsAppBtn: "تحدث عبر واتساب",
        revealPhoneBtn: "إظهار رقم الهاتف",
        formSuccess: "تم إرسال الرسالة بنجاح!",
        formError: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        whatsAppMessage: (property, path) => `
مرحباً،
أنا مهتم بهذا العقار:
النوع: ${property.category}
الموقع: ${property.region.ar}
الرابط: https://www.righthome.homes${path}
هل يمكنكم تزويدي بمزيد من المعلومات؟
        `
    }
};

// --- HELPER COMPONENT: Using Logical Properties for RTL/LTR ---
const FormInput = ({ icon, type, placeholder, name, required = false }) => (
    <div className="relative w-full">
        <div className="absolute top-1/2 -translate-y-1/2 text-stone-400 ltr:left-3 rtl:right-3">
            {icon}
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full bg-stone-100 border-2 border-transparent focus:border-sky-500 focus:bg-white transition-colors rounded-lg py-3 ps-10 pe-4 text-stone-800 placeholder:text-stone-400 focus:outline-none rtl:text-right"
            aria-label={name}
        />
    </div>
);

// --- MAIN CALLINFO COMPONENT ---
export default function CallInfo({ property }) {
    const { lang } = useAllContext();
    const t = translations[lang];

    const [showNumber, setShowNumber] = useState(false);
    const pathName = useLocation();
    const form = useRef();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState(false);
    
    const [formLoadTime, setFormLoadTime] = useState(Date.now());

    useEffect(() => {
        setFormLoadTime(Date.now());
    }, []);

    const phoneNumber = "+201019363939";
    const whatsappMessage = t.whatsAppMessage(property, pathName.pathname);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Bot protection
        if (form.current.honeypot.value) {
            console.log("Bot detected (honeypot).");
            return;
        }
        if ((Date.now() - formLoadTime) < 3000) {
            console.log("Bot detected (too fast).");
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitError(false);
        
        try {
            const formData = new FormData(form.current);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                submittedAt: new Date(),
                property: {
                    type: property.category,
                    location_en: property.region.en,
                    location_ar: property.region.ar,
                    link: `https://www.righthome.homes${pathName.pathname}`
                }
            };

            await addToCollection('users', userData);

            setSubmitMessage(t.formSuccess);
            setSubmitError(false);
            form.current.reset();
            setFormLoadTime(Date.now());
            localStorage.setItem('lastSubmissionTimestamp', Date.now().toString());

        } catch (error) {
            console.error('SUBMISSION FAILED:', error);
            setSubmitMessage(t.formError);
            setSubmitError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-5 bg-white border border-stone-200 shadow-xl rounded-2xl p-6">
            <div className="rtl:text-right">
                <h3 className="text-xl font-bold text-stone-800 tracking-tight">{t.title}</h3>
                <p className="text-sm text-stone-500 mt-1">{t.subtitle}</p>
                <form ref={form} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <input type="text" name="honeypot" style={{ display: 'none' }} />
                    <FormInput icon={<IoPersonOutline/>} type="text" name="name" placeholder={t.namePlaceholder} required />
                    <FormInput icon={<IoMailOutline/>} type="email" name="email" placeholder={t.emailPlaceholder} required />
                    <FormInput icon={<IoCallOutline/>} type="tel" name="phone" placeholder={t.phonePlaceholder} required />
                    <div className="relative w-full">
                        <div className="absolute top-4 text-stone-400 ltr:left-3 rtl:right-3">
                            <IoChatboxEllipsesOutline/>
                        </div>
                        <textarea
                            name="message"
                            placeholder={t.messagePlaceholder}
                            rows="4"
                            required
                            className="w-full bg-stone-100 border-2 border-transparent focus:border-sky-500 focus:bg-white transition-colors rounded-lg py-3 ps-10 pe-4 text-stone-800 placeholder:text-stone-400 focus:outline-none resize-none rtl:text-right"
                            aria-label="message"
                        ></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-sky-300/50 transform hover:-translate-y-0.5 disabled:bg-stone-400 disabled:shadow-none disabled:transform-none">
                        {isSubmitting ? t.submittingBtn : t.submitBtn}
                    </button>
                    {submitMessage && (
                        <p className={`text-center text-sm mt-2 ${submitError ? 'text-red-500' : 'text-green-600'}`}>
                            {submitMessage}
                        </p>
                    )}
                </form>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-grow h-px bg-stone-200"></div>
                <span className="text-xs font-semibold text-stone-400">{t.or}</span>
                <div className="flex-grow h-px bg-stone-200"></div>
            </div>
            <div className="flex flex-col gap-3">
                <a
                    href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-3 py-3 group transition-all duration-300 bg-green-500 hover:bg-green-600 w-full rounded-xl shadow-lg transform hover:scale-105 rtl:flex-row-reverse"
                >
                    <FaWhatsapp className="text-2xl text-white" />
                    <p className="font-semibold text-white">{t.whatsAppBtn}</p>
                </a>
                <button
                    className="flex justify-center items-center gap-3 bg-stone-800 hover:bg-stone-900 w-full rounded-xl py-3 transition-all duration-300 shadow-lg transform hover:scale-105"
                    onClick={() => setShowNumber((prev) => !prev)}
                >
                    <AnimatePresence mode="wait">
                        {!showNumber ? (
                            <motion.div
                                key="phone-text"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="flex justify-center items-center gap-3 text-white rtl:flex-row-reverse"
                            >
                                <IoCallOutline className="text-xl" />
                                <p className="font-semibold text-base">{t.revealPhoneBtn}</p>
                            </motion.div>
                        ) : (
                            <motion.a
                                key="phone-number"
                                href={`tel:${phoneNumber}`}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="font-semibold tracking-widest text-lg text-white"
                            >
                                {phoneNumber}
                            </motion.a>
                        )}
                    </AnimatePresence>
                </button>
            </div>
            <div className="mt-4 w-full flex justify-center gap-6 text-stone-400">
                <a href="https://www.facebook.com/profile.php?id=100064228025102" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 hover:text-sky-600">
                    <FaFacebookF className="text-2xl" />
                </a>
                <a href="https://www.instagram.com/right.homee" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 hover:text-sky-600">
                    <FaInstagram className="text-2xl" />
                </a>
            </div>
        </div>
    );
}