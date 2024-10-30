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
    <li className="mx-2 w-full rounded-2xl px-2 hover:bg-bg-hover">
      <button
        onClick={handleSelectItem}
        className="flex flex-row items-center text-text-primary"
      >
        {children}
      </button>
    </li>
  );
}

export default MenuItem;
