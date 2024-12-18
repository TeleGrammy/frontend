import { useDispatch, useSelector } from 'react-redux';
import {
  setOtherStories,
  setShowedOtherStoryIndex,
  setShowedOtherUserIndex,
} from '../../../slices/storiesSlice';
import { useEffect, useRef, useState } from 'react';

function StoriesList() {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { otherStories } = useSelector((state) => state.stories);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenStory = (index) => {
    dispatch(setShowedOtherUserIndex(index));
    dispatch(setShowedOtherStoryIndex(0));
  };

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

  if (loading) return <p data-test-id="loading-indicator">Loading...</p>;
  if (error)
    return <p data-test-id="error-message">Error loading stories: {error}</p>;

  return (
    <div className="relative mt-4 w-full" data-test-id="stories-list-container">
      <div
        ref={scrollRef}
        className="scrollable flex flex-row-reverse gap-3 overflow-x-scroll px-4 py-2"
        data-test-id="scrollable-stories-container"
      >
        {otherStories &&
          otherStories.map((collection, index) => {
            const numStories = collection.stories.length;
            const dashLength = (2 * Math.PI * 20) / numStories; // circumference divided by number of stories
            const gapLength = numStories > 1 ? 5 : 0; // Adjust as needed for spacing

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
                    stroke="green"
                    strokeWidth="3"
                    strokeDasharray={`${dashLength} ${gapLength}`}
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
