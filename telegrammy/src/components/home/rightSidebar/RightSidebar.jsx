import { useDispatch, useSelector } from 'react-redux';

import MyStories from './MyStories';
import GroupOrChannelInfo from '../chat/GroupOrChannelInfo';
import ChannelInfo from '../chat/ChannelInfo';
import { useEffect } from 'react';
import { closeRightSidebar } from '../../../slices/sidebarSlice';
import CallsLog from './CallsLog';

function RightSidebar() {
  const { currentRightSidebar } = useSelector((state) => state.sidebar);
  const { openedChat } = useSelector((state) => state.chats);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !openedChat?.isChannel &&
      !openedChat?.isGroup &&
      currentRightSidebar !== 'My Stories' &&
      currentRightSidebar !== 'Calls'
    )
      dispatch(closeRightSidebar());
  }, [openedChat]);

  return (
    <div
      className="relative flex h-screen flex-col items-center bg-bg-primary"
      style={{ width: `25vw` }}
    >
      {/* Components to render */}
      {/* ChatList component */}
      {currentRightSidebar === 'My Stories' && <MyStories />}
      {currentRightSidebar === 'Group Info' && <GroupOrChannelInfo />}
      {currentRightSidebar === 'Channel Info' && <ChannelInfo />}

      {currentRightSidebar === 'Calls' && <CallsLog />}

      {/** setting component */}
      {/* {currentRightSidebar === '' && < />} */}
    </div>
  );
}

export default RightSidebar;
