import { useDispatch, useSelector } from 'react-redux';
import {
  setOtherStories,
  setShowedOtherStoryIndex,
  setShowedOtherUserIndex,
} from '../../../slices/storiesSlice';
import { useEffect, useRef, useState } from 'react';
import { BeatLoader } from 'react-spinners';

const apiUrl = import.meta.env.VITE_API_URL;

function StoriesList() {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { otherStories } = useSelector((state) => state.stories);
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenStory = (index) => {
    dispatch(setShowedOtherUserIndex(index));
    dispatch(setShowedOtherStoryIndex(0));
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${apiUrl}/v1/user/stories/contacts/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stories.');
        } else {
          console.log('stories have been fetched successfully.');
        }
        const data = await response.json();
        const fetchedStories = data.data;
        console.log(fetchedStories);
        dispatch(setOtherStories(fetchedStories));
      } catch (error) {
        setError(error.message);
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const scrollableDiv = scrollRef.current;
    const handleWheel = (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        scrollableDiv.scrollLeft -= event.deltaY;
      }
    };

    if (scrollableDiv) {
      scrollableDiv.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  if (error)
    return <p data-test-id="error-message">Error loading stories: {error}</p>;

  return (
    <div className="relative mt-4 w-full" data-test-id="stories-list-container">
      <div
        ref={scrollRef}
        className="scrollable flex h-20 flex-row-reverse items-center gap-3 overflow-x-scroll px-4 py-2"
        data-test-id="scrollable-stories-container"
      >
        {loading && (
          <div className="m-auto">
            <BeatLoader color="gray" size={15} margin={10} />{' '}
          </div>
        )}
        {!loading &&
          otherStories &&
          otherStories.map((collection, index) => {
            const numStories = collection.stories.length;
            const dashLength = (2 * Math.PI * 28) / numStories; // circumference divided by number of stories
            const gapLength = numStories > 1 ? 5 : 0; // Adjust as needed for spacing

            const viewerIds = collection.stories.flatMap((story) => {
              if (story.viewers) {
                return Object.keys(story.viewers).map((viewerId) => viewerId);
              }
            });
            const seen = viewerIds.includes(user._id);

            return (
              <div
                key={index}
                className="relative shrink-0"
                onClick={() => handleOpenStory(index)}
                data-test-id={`${index}-story-item`}
              >
                {/* SVG Border with Dashes */}
                <svg
                  className="absolute left-0 top-0 overflow-visible"
                  width="60"
                  height="60"
                  data-test-id={`${index}-story-border`}
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="30"
                    fill="none"
                    stroke={seen ? 'gray' : 'green'}
                    strokeWidth="3"
                    strokeDasharray={`${dashLength} ${gapLength}`}
                    strokeDashoffset="43"
                  />
                </svg>

                {/* Story Image */}
                <img
                  src={collection.stories[0].media}
                  className="h-14 w-14 rounded-full"
                  alt={`story${index}`}
                  data-test-id={`${index}-story-image`}
                />
              </div>
            );
          })}
      </div>
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-bg-primary to-transparent"
        data-test-id="gradient-overlay"
      ></div>
    </div>
  );
}

export default StoriesList;
