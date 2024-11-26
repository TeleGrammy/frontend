
import Header from "../leftSidebar/Header";
import CloseButton from "./CloseButton";
import SelectedInfo from "./SelectedInfo";


function RightSidebar() {


    return (
        <div className="relative flex h-screen flex-col items-center bg-bg-primary"
        style={{ width: `25vw` }}>
            <Header className={"h-[3.4rem]"}>
                <CloseButton />
                <SelectedInfo />
            </Header>

            {/*show stories Stories*/}
        </div>
    )
}

export default RightSidebar;
