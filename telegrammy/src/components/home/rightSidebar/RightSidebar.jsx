import { useDispatch, useSelector } from 'react-redux';

import MyStories from './MyStories';
import GroupOrChannelInfo from '../chat/GroupOrChannelInfo';
import AddUsersList from '../leftSidebar/AddUsersList';
import { IoAdd } from 'react-icons/io5';
import { closeRightSidebar } from '../../../slices/sidebarSlice';
import {
  setShowedMyStoryIndex,
  setMyStories,
} from '../../../slices/storiesSlice';
import { useEffect, useState } from 'react';

function RightSidebar() {
  const { currentRightSidebar } = useSelector((state) => state.sidebar);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenStory = (index) => {
    dispatch(setShowedMyStoryIndex(index));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          'http://localhost:8080/api/v1/user/stories/',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json', // Specify JSON response expected
            },
            credentials: 'include', // Include credentials (cookies)
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const data = await response.json();
        const stories = data.data;
        console.log(stories);
        dispatch(setMyStories(stories));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [dispatch, setError, setLoading]);

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
