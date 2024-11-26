import { useSelector } from "react-redux";

function SelectedInfo() {
    const { currentRightSidebar } = useSelector((state) => state.sidebar);

    return (
        <h1 className="text-text-primary mx-4 mb-1 text-xl leading-none">
            {currentRightSidebar}
        </h1>
    )
}

export default SelectedInfo;
