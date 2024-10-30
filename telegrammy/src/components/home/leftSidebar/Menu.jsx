import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'; // Import hooks

import { ToggleDarkMode } from '../../../slices/darkModeSlice';
import MenuItem from "./MenuItem";

import { FaCog, FaMoon, FaSun, FaComments, FaBars, FaBullseye  } from 'react-icons/fa';

const Menuitems = [
  {Name:"ChatList", icon:<FaComments/>, newMenu:"ChatList", isRightSidebar: false },
 {Name:"Setting", icon:<FaCog/>, newMenu:"Setting", isRightSidebar: false },
 {Name:"My Stories", icon:<FaBullseye />, newMenu:"My Stories", isRightSidebar: true },
]

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useDispatch(); 
  const { isDarkTheme } = useSelector((state) => state.darkMode);


  return (
    <>
    <div className="cursor-pointer flex items-center justify-center min-w-8 min-h-8 hover:bg-bg-secondary rounded-full"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <FaBars className="text-text-primary opacity-70" />
    </div>
    {isMenuOpen && (
      <div className={`absolute top-[4rem] left-4 bg-bg-primary border border-border rounded-2xl min-w-60 shadow-xl opacity-80`}>
      <ul className="flex flex-col text-l items-start justify-start space-y-2 p-2 px-4">
        {Menuitems.map((item) => 
          <MenuItem key={item.Name} isRightSidebar={item.isRightSidebar} setIsMenuOpen={setIsMenuOpen} newMenu={item.newMenu}>
          {item.icon}
          <span className="ml-4">{item.Name}</span>
          </MenuItem>
        )}
        <li className="hover:bg-bg-hover w-full mx-2 px-2 rounded-2xl">
              <button onClick={() => dispatch(ToggleDarkMode())} className="text-text-primary hover:text-gray-300 flex flex-row items-center w-full">
                {isDarkTheme ? <FaSun /> : <FaMoon />}
                <span className="ml-4">{isDarkTheme ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </li>
      </ul>
      <p className="text-xxs text-center p-4 text-[rgb(172,167,167)]">TeleGrammmy Web A 1</p>
    </div>
    )
  }
  </>
  );
}

export default Menu;