import { useDispatch, useSelector } from 'react-redux';

import Header from '../leftSidebar/Header';
import CloseButton from './CloseButton';
import SelectedInfo from './SelectedInfo';
import MyStory from './MyStory';

import AddStory from './AddStory';
import { IoAdd } from 'react-icons/io5';
import { closeRightSidebar } from '../../../slices/sidebarSlice';
import {
  setShowedMyStoryIndex,
  setMyStories,
} from '../../../slices/storiesSlice';
import { useEffect, useState } from 'react';

function RightSidebar() {
  const { myStories } = useSelector((state) => state.stories);
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
      className="relative flex h-screen flex-col items-center overflow-y-auto bg-bg-primary"
      style={{ width: `25vw` }}
    >
      {/* Header info */}
      <Header className={'h-[3.4rem]'}>
        <CloseButton handleClick={() => dispatch(closeRightSidebar())} />
        <SelectedInfo />
      </Header>

      {/* My Stories */}
      <div className="grid w-full grid-cols-3 gap-4 p-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading stories: {error}</p>}
        {!loading &&
          !error &&
          myStories
            .filter((story) => Date.now() < new Date(story.expiresAt))
            .map((story, index) => (
              <MyStory
                key={index}
                story={story}
                index={index}
                handleClick={() => handleOpenStory(index)}
              />
            ))}
      </div>

      {/* Add Story Button and logic for add story */}
      <AddStory />
    </div>
  );
}

export default RightSidebar;
