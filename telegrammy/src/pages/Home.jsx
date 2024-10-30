import { useEffect } from "react";
import { useSelector } from "react-redux";

import SideBar from "../components/home/SideBar";
import Chat from "../components/home/Chat";


function Home() {
    const { isDarkTheme } = useSelector((state) => state.darkMode);

useEffect(() => {
    if(isDarkTheme){
        document.documentElement.classList.add('dark-theme');
    }else{
        document.documentElement.classList.remove('dark-theme');
    }
},[isDarkTheme]);

    return (
        <div className="chat-bg flex h-screen w-screen flex-row">
            <SideBar/>
            <Chat />
        </div>
    )
}

export default Home;
