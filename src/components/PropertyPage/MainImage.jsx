export default function MainImage({ imgCont, title, OpenModal}) {
  return (
    <div className="relative lg:self-start group flex flex-grow justify-center overflow-hidden items-center max-w-full w-full max-h-[300px] md:w-[100%] lg:max-w-[605px] xl:max-w-[705px] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[450px] xl:min-h-[500px] lg:max-h-[500px]">
      <img
        className="w-full lg:w-full max-h-full transition brightness-50 group-hover:brightness-100"
        src={imgCont}
        alt={title.en}
      />
      <div
        onClick={OpenModal}
        className="absolute h-full w-full flex items-center justify-center cursor-pointer"
      >
        <button className="text-stone-300 hover:text-stone-900 bg-stone-900/40 hover:bg-slate-50/90 transition px-4 py-1">
          View full Images
        </button>
      </div>
    </div>
  );
}
