import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import Header from '../leftSidebar/Header';
import CloseButton from './CloseButton';
import SelectedInfo from './SelectedInfo';
import MyStory from './MyStory';

import AddStory from './AddStory';
import {
  setShowedMyStoryIndex,
  setMyStories,
} from '../../../slices/storiesSlice';
import { BeatLoader } from 'react-spinners';

const apiUrl = import.meta.env.VITE_API_URL;

function MyStories() {
  const { myStories } = useSelector((state) => state.stories);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleOpenStory = (index) => {
    dispatch(setShowedMyStoryIndex(index));
  };

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiUrl}/v1/user/stories/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json', // Specify JSON response expected
          },
          credentials: 'include', // Include credentials (cookies)
        });
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
    <>
      {/* Header info */}
      <Header className={'h-[3.4rem]'}>
        <CloseButton />
        <SelectedInfo />
      </Header>
      {loading && (
        <div className="m-auto h-20">
          <BeatLoader color="gray" size={15} margin={10} />
        </div>
      )}
      {/* My Stories */}
      <div className="grid w-full grid-cols-3 gap-4 p-4">
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
    </>
  );
}

export default MyStories;
