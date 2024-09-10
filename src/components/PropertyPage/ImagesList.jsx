export default function ImagesList({ images, imgCont, setImgCont }) {
  return (
    <ul className="flex order-1 lg:order-none lg:flex-col gap-2 *:size-3 cursor-pointer overflow-scroll hide-scrollbar max-w-full min-w-fit">
      {images.map((image, index) => {
        return (
          <li
            key={image + index}
            onClick={() => setImgCont(image)}
            className={`border rounded-full transition relative overflow-hidden flex items-center justify-center hover:border-stone-950 hover:bg-stone-100 ${
              imgCont === image ? "border-stone-950 bg-stone-100" : ""
            }`}
          >
            <span className="size-1.5 bg-black rounded-full"></span>
          </li>
        );
      })}
    </ul>
  );
}
