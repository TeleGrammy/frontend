import { useEffect } from "react";
import { useSelector } from "react-redux";

import Sidebar from "../components/home/leftSidebar/Sidebar";
import Chat from "../components/home/chat/Chat";
import RightSidebar from "../components/home/rightSidebar/RightSidebar";


function Home() {
    const { isDarkTheme } = useSelector((state) => state.darkMode);

    const { isRightSidebarOpen } = useSelector((state) => state.sidebar);

useEffect(() => {
    if(isDarkTheme){
        document.documentElement.classList.add('dark-theme');
    }else{
        document.documentElement.classList.remove('dark-theme');
    }
}, [isDarkTheme]);

    return (
        <div className="chat-bg flex h-screen w-screen flex-row">
            <Sidebar/>
            <Chat />
            {isRightSidebarOpen && <RightSidebar />}
        </div>
    )
}

export default Home;
