import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import hooks
import { useNavigate } from 'react-router-dom';

import { ToggleDarkMode } from '../../../slices/darkModeSlice';
import { logout } from '../../../slices/authSlice';
import { AiOutlineLogout } from 'react-icons/ai';
import MenuItem from './MenuItem';

import { ClipLoader } from 'react-spinners';
import {
  FaCog,
  FaMoon,
  FaSun,
  FaComments,
  FaBars,
  FaBullseye,
  FaSignOutAlt,
} from 'react-icons/fa';
import { setOpenedChat } from '../../../slices/chatsSlice';

import { endCall } from '../../../slices/callSlice';

import { MdCall } from 'react-icons/md';

const apiUrl = import.meta.env.VITE_API_URL;

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
  {
    Name: 'Calls',
    icon: <MdCall />,
    newMenu: 'Calls',
    isRightSidebar: true,
  },
];

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isloggingOut, setIsloggingOut] = useState(false);
  const [isloggingOutFromAll, setIsloggingOutFromAll] = useState(false);

  const menuRef = useRef(null);
  const barsRef = useRef(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isDarkTheme } = useSelector((state) => state.darkMode);

  const Logout = async () => {
    try {
      setIsloggingOut(true);
      const response = await fetch(`${apiUrl}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout Success');
        dispatch(setOpenedChat(null));
        dispatch(endCall());
        dispatch(logout());
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloggingOut(false);
    }
  };

  const LogoutFromAll = async () => {
    try {
      setIsloggingOutFromAll(true);
      const response = await fetch(
        `${apiUrl}/v1/auth/logout-from-all-devices`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (response.ok) {
        console.log('Logout Success');
        dispatch(setOpenedChat(null));
        dispatch(endCall());
        dispatch(logout());
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloggingOutFromAll(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !barsRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={barsRef}
        className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-full hover:bg-bg-secondary"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        data-test-id="menu-button"
      >
        <FaBars className="text-text-primary opacity-70" />
      </div>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`absolute left-4 top-[4rem] z-10 min-w-60 rounded-2xl border border-border bg-bg-primary opacity-80 shadow-xl`}
          data-test-id="menu-container"
        >
          <ul className="text-l flex flex-col items-start justify-start space-y-2 p-2 px-4">
            {Menuitems.map((item) => (
              <MenuItem
                key={item.Name}
                isRightSidebar={item.isRightSidebar}
                setIsMenuOpen={setIsMenuOpen}
                newMenu={item.newMenu}
                data-test-id={`menu-item-${item.Name.replace(' ', '-').toLowerCase()}`}
              >
                {item.icon}
                <span
                  className="ml-4"
                  data-test-id={`menu-item-label-${item.Name.replace(' ', '-').toLowerCase()}`}
                >
                  {item.Name}
                </span>
              </MenuItem>
            ))}
            <li
              onClick={() => dispatch(ToggleDarkMode())}
              className="mx-2 flex w-full cursor-pointer flex-row items-center rounded-2xl px-2 text-text-primary hover:bg-bg-hover"
              data-test-id="dark-mode-button"
            >
              {isDarkTheme ? <FaSun /> : <FaMoon />}
              <span className="ml-4">
                {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
              </span>
            </li>
            <li
              onClick={Logout}
              className="mx-2 flex w-full cursor-pointer flex-row items-center rounded-2xl px-2 text-text-primary hover:bg-bg-hover"
              data-test-id="logout-button"
            >
              {isloggingOut ? (
                <ClipLoader size={17} color={'text-text-primary'} />
              ) : (
                <FaSignOutAlt />
              )}
              <span className="ml-4">Log Out</span>
            </li>

            <li
              onClick={LogoutFromAll}
              className="mx-2 flex w-full cursor-pointer flex-row items-center rounded-2xl px-2 text-text-primary hover:bg-bg-hover"
              data-test-id="logout-button"
            >
              {isloggingOutFromAll ? (
                <ClipLoader size={17} color={'text-text-primary'} />
              ) : (
                <AiOutlineLogout />
              )}
              <span className="ml-4">Log Out From All</span>
            </li>
          </ul>
          <p
            className="p-4 text-center text-xxs text-[rgb(172,167,167)]"
            data-test-id="menu-footer"
          >
            TeleGrammmy Web A 1
          </p>
        </div>
      )}
    </>
  );
}

export default Menu;
