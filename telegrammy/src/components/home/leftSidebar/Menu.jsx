import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import hooks

import { ToggleDarkMode } from '../../../slices/darkModeSlice';
import MenuItem from './MenuItem';

import {
  FaCog,
  FaMoon,
  FaSun,
  FaComments,
  FaBars,
  FaBullseye,
} from 'react-icons/fa';

const Menuitems = [
  {
    Name: 'ChatList',
    icon: <FaComments />,
    newMenu: 'ChatList',
    isRightSidebar: false,
  },
  {
    Name: 'Setting',
    icon: <FaCog />,
    newMenu: 'Setting',
    isRightSidebar: false,
  },
  {
    Name: 'My Stories',
    icon: <FaBullseye />,
    newMenu: 'My Stories',
    isRightSidebar: true,
  },
];

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const { isDarkTheme } = useSelector((state) => state.darkMode);

  return (
    <>
      <div
        className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-full hover:bg-bg-secondary"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaBars className="text-text-primary opacity-70" />
      </div>
      {isMenuOpen && (
        <div
          className={`absolute left-4 top-[4rem] min-w-60 rounded-2xl border border-border bg-bg-primary opacity-80 shadow-xl`}
        >
          <ul className="text-l flex flex-col items-start justify-start space-y-2 p-2 px-4">
            {Menuitems.map((item) => (
              <MenuItem
                key={item.Name}
                isRightSidebar={item.isRightSidebar}
                setIsMenuOpen={setIsMenuOpen}
                newMenu={item.newMenu}
              >
                {item.icon}
                <span className="ml-4">{item.Name}</span>
              </MenuItem>
            ))}
            <li
              onClick={() => dispatch(ToggleDarkMode())}
              className="mx-2 flex w-full cursor-pointer flex-row items-center rounded-2xl px-2 text-text-primary hover:bg-bg-hover"
            >
              {isDarkTheme ? <FaSun /> : <FaMoon />}
              <span className="ml-4">
                {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
              </span>
            </li>
          </ul>
          <p className="p-4 text-center text-xxs text-[rgb(172,167,167)]">
            TeleGrammmy Web A 1
          </p>
        </div>
      )}
    </>
  );
}

export default Menu;
