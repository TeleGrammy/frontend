import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Sidebar from '../components/home/leftSidebar/Sidebar';
import Chat from '../components/home/chat/Chat';
import RightSidebar from '../components/home/rightSidebar/RightSidebar';
import MediaShower from '../Components/home/imageShower/MediaShower';

function Home() {
  const { myStories, showedStoryIndex } = useSelector((state) => state.stories);

  const { isDarkTheme } = useSelector((state) => state.darkMode);

  const { isRightSidebarOpen } = useSelector((state) => state.sidebar);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  return (
    <div className="chat-bg flex h-screen w-screen flex-row">
      <Sidebar />
      <Chat />
      {isRightSidebarOpen && <RightSidebar />}
      {showedStoryIndex !== null && (
        <MediaShower medias={myStories} initialStoryIndex={showedStoryIndex} />
      )}
    </div>
  );
}

export default Home;
