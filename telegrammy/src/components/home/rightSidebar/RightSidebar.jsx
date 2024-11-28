import { useSelector } from 'react-redux';

import MyStories from './MyStories';
import GroupInfo from '../chat/GroupInfo';

function RightSidebar() {
  const { currentRightSidebar } = useSelector((state) => state.sidebar);

  return (
    <div
      className="relative flex h-screen flex-col items-center overflow-y-auto bg-bg-primary"
      style={{ width: `25vw` }}
    >
      {/* Components to render */}
      {/* ChatList component */}
      {currentRightSidebar === 'My Stories' && <MyStories />}
      {currentRightSidebar === 'Group Info' && <GroupInfo />}

      {/** setting component */}
      {/* {currentRightSidebar === '' && < />} */}
    </div>
  );
}

export default RightSidebar;
