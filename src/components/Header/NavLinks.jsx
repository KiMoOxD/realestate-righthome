import { NavLink } from "react-router-dom";
import { useAllContext } from "../../context/AllContext";


export default function NavLinks() {
  let {lang} = useAllContext()

  return (
    <ul className="hidden lg:flex gap-2 *:w-28 *:h-14 *:py-2 *:flex *:justify-center *:transition *:cursor-pointer *:items-center">
      <NavLink className="hover:bg-blue-500 hover:text-white" to={'/'}>
        <li>{lang === 'en' ? 'Home' : 'الرئيسية'}</li>
      </NavLink>
      <NavLink className="hover:bg-blue-500 hover:text-white" to={'browse'}>
        <li>{lang === 'en' ? 'Browse' : 'تصفح'}</li>
      </NavLink>
    </ul>
  );
}
