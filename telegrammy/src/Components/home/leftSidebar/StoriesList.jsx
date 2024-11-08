import { useDispatch, useSelector } from 'react-redux';
import { setShowedStoryIndex } from '../../../slices/storiesSlice';
import { useEffect, useRef } from 'react';

function StoriesList() {
  const dispatch = useDispatch();

  const scrollRef = useRef();

  const { otherStories } = useSelector((state) => state.stories);

  const handleOpenStory = (index) => {
    dispatch(setShowedStoryIndex(index));
  };

  useEffect(() => {
    const scrollableDiv = scrollRef.current;
    const handleWheel = (event) => {
      if (event.deltaY !== 0) {
        // Prevent the default vertical scroll behavior
        event.preventDefault();
        // Scroll horizontally based on the vertical scroll amount
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

  return (
    <div className="relative mt-4 w-full">
      <div
        ref={scrollRef}
        className="scrollable flex flex-row-reverse gap-3 overflow-x-scroll px-4 py-2"
      >
        {otherStories
          .filter((story) => Date.now() < new Date(story.expiresAt))
          .map((story, index) => (
            <div
              key={index}
              className="shrink-0"
              onClick={() => handleOpenStory(index)}
            >
              <img
                src={story.media}
                className="h-14 w-14 rounded-full border-2 border-green-500"
                alt={`story${index}`}
              />
            </div>
          ))}
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-bg-primary to-transparent"></div>
    </div>
  );
}

export default StoriesList;
