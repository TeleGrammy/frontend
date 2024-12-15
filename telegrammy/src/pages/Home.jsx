import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { updateTime, setIntervalId } from '../slices/callSlice';

import { useSocket } from '../contexts/SocketContext';

import Sidebar from '../components/home/leftSidebar/Sidebar';
import Chat from '../components/home/chat/Chat';
import RightSidebar from '../components/home/rightSidebar/RightSidebar';
import MediaShower from '../components/home/imageShower/MediaShower';
import CallOverlay from '../components/home/voicecall/CallOverlay';
import CallBar from '../components/home/voicecall/CallBar';
import Callee from '../components/home/voicecall/Callee';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Convert callTime (MM:SS) to seconds
const convertToSeconds = (formattedTime) => {
  const [minutes, seconds] = formattedTime.split(':').map(Number);
  return minutes * 60 + seconds;
};

function Home() {
  const socket = useSocket();

  const dispatch = useDispatch();

  const {
    myStories,
    otherStories,
    showedMyStoryIndex,
    showedOtherStoryIndex,
    showedOtherUserIndex,
  } = useSelector((state) => state.stories);

  const { isDarkTheme } = useSelector((state) => state.darkMode);

  const { isCallOverlayOpen, callState, callTime, intervalId } = useSelector(
    (state) => state.call,
  );

  const { isRightSidebarOpen } = useSelector((state) => state.sidebar);

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const callTimeRef = useRef(callTime); // Use a ref to store the current callTime

  useEffect(() => {
    callTimeRef.current = callTime; // Update ref with the latest callTime from Redux
  }, [callTime]);

  // Start the timer only once when the call is accepted
  useEffect(() => {
    if (callState === 'in call' && !intervalId) {
      const interval = setInterval(() => {
        const currentTimeInSeconds = convertToSeconds(callTimeRef.current) + 1;
        const formattedTime = formatTime(currentTimeInSeconds);
        dispatch(updateTime(formattedTime)); // Update the time in 'MM:SS' format
      }, 1000);

      dispatch(setIntervalId(interval)); // Store the interval ID in Redux
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [callState, intervalId, dispatch]);

  return (
    <div className="chat-bg flex h-screen w-screen flex-row">
      {!isCallOverlayOpen && callState !== 'no call' && <CallBar />}

      <Sidebar />

      <Chat />

      {isRightSidebarOpen && <RightSidebar />}

      {showedMyStoryIndex !== null && (
        <MediaShower
          medias={myStories}
          initialStoryIndex={showedMyStoryIndex}
        />
      )}
      {showedOtherStoryIndex !== null && (
        <MediaShower
          medias={otherStories[showedOtherUserIndex].stories}
          initialStoryIndex={showedOtherStoryIndex}
        />
      )}

      {/* Show the call overlay and Callee functions */}
      <CallOverlay
        localAudioRef={localAudioRef}
        remoteAudioRef={remoteAudioRef}
      />
      <Callee localAudioRef={localAudioRef} remoteAudioRef={remoteAudioRef} />

      <ToastContainer />
    </div>
  );
}

export default Home;
