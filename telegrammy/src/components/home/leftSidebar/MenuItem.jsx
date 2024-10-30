import { useDispatch } from "react-redux";

import { setcurrentMenu, setRightSidebar } from "../../../slices/sidebarSlice";


function MenuItem({ isRightSidebar, setIsMenuOpen, newMenu, children }) {

    const dispatch = useDispatch();

    const handleSelectItem = () => {
        setIsMenuOpen(false);

        if(isRightSidebar) {
            dispatch(setRightSidebar(newMenu));
        }
        else {
          dispatch(setcurrentMenu(newMenu));
        }
    }

    return (
        <li className="hover:bg-bg-hover w-full mx-2 px-2 rounded-2xl">
          <button onClick={handleSelectItem} className="text-text-primary flex flex-row items-center">
            {children}
          </button>
        </li>
    )
}

export default MenuItem;
