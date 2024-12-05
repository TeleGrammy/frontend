import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../components/home/leftSidebar/Sidebar';
import Chat from '../components/home/chat/Chat';
import RightSidebar from '../components/home/rightSidebar/RightSidebar';
import MediaShower from '../Components/home/imageShower/MediaShower';

function Home() {
  const {
    myStories,
    otherStories,
    showedMyStoryIndex,
    showedOtherStoryIndex,
    showedOtherUserIndex,
  } = useSelector((state) => state.stories);

  const { user } = useSelector((state) => state.auth);

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

      {showedMyStoryIndex !== null && (
        <MediaShower
          medias={myStories}
          profile={user}
          initialStoryIndex={showedMyStoryIndex}
        />
      )}
      {showedOtherStoryIndex !== null && (
        <MediaShower
          medias={otherStories[showedOtherUserIndex].stories}
          profile={otherStories[showedOtherStoryIndex].profile}
          initialStoryIndex={showedOtherStoryIndex}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
