import { useDispatch } from "react-redux";

import { closeRightSidebar } from "../../../slices/sidebarSlice";

import { IoCloseSharp } from "react-icons/io5";

function CloseButton() {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(closeRightSidebar());
    }
    return (
        <div className="text-2xl flex items-center justify-center
            cursor-pointer min-w-8 min-h-8
            hover:bg-bg-secondary rounded-full text-text-primary"
            onClick={handleClick}>
            <IoCloseSharp />
        </div>
    )
}

export default CloseButton;
