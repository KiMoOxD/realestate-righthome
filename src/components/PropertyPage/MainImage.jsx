export default function MainImage({ imgCont, title, OpenModal}) {
  return (
    <div className="relative lg:self-start flex flex-grow justify-center overflow-hidden items-center max-w-full w-full max-h-[300px] md:w-[75%] lg:w-[600px] xl:w-[550px] 2xl:w-[600px] lg:min-h-[350px] lg:max-h-[500px]">
      <img
        className="w-full lg:w-full max-h-full"
        src={imgCont}
        alt={title.en}
      />
      <div
        onClick={OpenModal}
        className="absolute h-full w-full bg-black/70 flex items-center justify-center cursor-pointer"
      >
        <button className="text-stone-300 hover:text-stone-00 bg-slate-50/10 hover:bg-slate-50/5 transition px-4 py-1">
          View full Images
        </button>
      </div>
    </div>
  );
}
