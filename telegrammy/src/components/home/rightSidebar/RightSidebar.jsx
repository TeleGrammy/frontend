import { useSelector } from 'react-redux';

import MyStories from './MyStories';
import GroupOrChannelInfo from '../chat/GroupOrChannelInfo';
import AddUsersList from '../leftSidebar/AddUsersList';

function RightSidebar() {
  const { currentRightSidebar } = useSelector((state) => state.sidebar);

  return (
    <div
      className="relative flex h-screen flex-col items-center overflow-y-hidden bg-bg-primary"
      style={{ width: `25vw` }}
    >
      {/* Components to render */}
      {/* ChatList component */}
      {currentRightSidebar === 'My Stories' && <MyStories />}
      {currentRightSidebar === 'Group Info' && <GroupOrChannelInfo />}
      {currentRightSidebar === 'Channel Info' && <GroupOrChannelInfo />}

      {/** setting component */}
      {/* {currentRightSidebar === '' && < />} */}
    </div>
  );
}

export default RightSidebar;
