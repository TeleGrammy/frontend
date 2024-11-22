import { useDispatch } from 'react-redux';

import { setcurrentMenu, setRightSidebar } from '../../../slices/sidebarSlice';

function MenuItem({ isRightSidebar, setIsMenuOpen, newMenu, children }) {
  const dispatch = useDispatch();

  const handleSelectItem = () => {
    setIsMenuOpen(false);

    if (isRightSidebar) {
      dispatch(setRightSidebar(newMenu));
    } else {
      dispatch(setcurrentMenu(newMenu));
    }
  };

  return (
    <li
      onClick={handleSelectItem}
      className="mx-2 flex w-full cursor-pointer flex-row items-center rounded-2xl px-2 text-text-primary hover:bg-bg-hover"
    >
      {children}
    </li>
  );
}

export default MenuItem;
