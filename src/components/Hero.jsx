import { useAllContext } from "../context/AllContext";
import img from '../images/landing.jpg'
import Select from 'react-select'
import { CiSearch } from "react-icons/ci";



const TypeOptions = [
  { value: '1', label: 'Apartement' },
  { value: '2', label: 'House' },
  { value: '3', label: 'Tower' }
]

const LocationOptions = [
    { value: '1', label: 'Alexandria' },
    { value: '2', label: 'Cairo' },
    { value: '3', label: 'North Cost' }
  ]

  const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: 'none',  // Remove the border
        boxShadow: 'none', // Remove box shadow on focus
        '&:hover': {
          boxShadow: 'none',  // Remove hover effect on input
        },
        textAlign: 'left',  // Ensure text aligns to the left
      }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: 'left',  // Align placeholder text to the left
      color: 'black',  // Change placeholder text color to black
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: 'left',  // Align selected option text to the left
      color: 'black',  // Change selected text color to black
    }),
    option: (provided, state) => ({
      ...provided,
      color: 'black',  // Change the color of the options text to black
      backgroundColor: state.isSelected ? '#f0f0f0' : state.isFocused ? '#e6e6e6' : 'white',  // Highlight selected and hovered option
      textAlign: 'left',  // Align option text to the left
      '&:hover': {
        backgroundColor: '#e6e6e6',  // Add hover effect on options
      },
    }),
  };

export default function Hero() {
    // let {lang} = useAllContext()
  return (
    <section className="relative flex items-center justify-center min-h-[80vh]  bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${img})`}}>
      <div className="absolute inset-0 z-2 bg-gray-900/30 sm:from-cyan-900/95 sm:to-gray-900/25"></div>
      <div className="relative p-2 text-center text-white">
        <p className="mt-3 sm:mt-0 text-5xl sm:text-6xl md:text-7xl font-semibold mb-5">Find Your Dream Home</p>
        <p className="max-w-xl text-sm mx-auto text-stone-200">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio voluptates nemo neque laudantium perferendis fuga nesciunt eum sunt sed animi.</p>
        <div className="relative flex justify-center gap-2 mt-12">
            <button type="button" className="bg-blue-500 px-6 py-2 rounded-full relative">
                For Rent
                <div className="absolute top-full left-1/2 translate-x-[-50%] size-4 border-8 border-blue-500 border-l-transparent border-r-transparent border-b-transparent"></div>
            </button>
            <button type="button" className="bg-blue-500 px-6 py-2 rounded-full relative">For Sale</button>
        </div>
        <div className="md:flex flex-wrap grid grid-cols-1 items-center bg-white gap-1 text-sm pt-3 pb-2 px-6 md:rounded-full mt-7 text-stone-500">
            <div className="flex flex-col gap-0.5 basis-1/4">
                <p className="self-start pl-2">Type</p>
                <Select options={TypeOptions} styles={customStyles}/>
            </div>
            <div className="flex flex-col gap-0.5 basis-1/4">
                <p className="self-start pl-2">Governate</p>
                <Select options={LocationOptions} styles={customStyles}/>
            </div>
            <div className="flex flex-grow flex-col gap-0.5">
                <p className="self-start pl-2">Search </p>
                <input type="text" className="outline-none p-2 border rounded-full"/>
            </div>
            <button type="button" className="flex justify-center gap-1  items-center mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 ml-4 px-6 py-3 h-fit text-white rounded-full mb-2">Search <CiSearch className="text-lg"/></button>
        </div>
      </div>
      {/* <div className={`relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 md:flex lg:h-screen ${lang === 'en' ? 'sm:justify-start' : 'sm:justify-end'} lg:items-center lg:px-8`}>
        <div className={`max-w-xl text-center ${lang === 'en' ? 'sm:text-left' : 'sm:text-right'}`}>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
          {lang === 'en' ? 'Let us find your' : 'خلي علينا البحث عن'}
            <p className="block font-extrabold text-rose-500">
            {lang === 'en' ? 'Forever Home.' : 'شالية الساحل'}
            </p>
          </h1>

          <p className={`mt-4 ${lang === 'ar' && 'ml-auto'} max-w-lg text-white ${lang === 'en' ? 'sm:text-left' : 'sm:text-right'} sm:text-xl/relaxed`}>
          {lang === 'en' ? 
            `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
            illo tenetur fuga ducimus numquam ea! Home.` 
            : `اي كلام بالعربي لحد ما نلاقي اي كلام بس كدا سهلة اهي زود اي كلام`}
          </p>

          <div className={`mt-8 flex ${lang === 'en' ? 'sm:justify-start' : 'sm:justify-end'} flex-wrap gap-4 text-center`}>
            <a
              href="#"
              className="block w-full rounded bg-cyan-900 px-12 py-3 text-sm font-medium text-white shadow hover:bg-cyan-950 focus:outline-none sm:w-auto"
            >
              {lang === 'en' ? 'Get Started' : 'يلا بينا'}
            </a>
          </div>
        </div>
      </div> */}
    </section>
  );
}

