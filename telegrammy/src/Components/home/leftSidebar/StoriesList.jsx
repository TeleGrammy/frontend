import { useDispatch, useSelector } from 'react-redux';
import { setShowedStoryIndex } from '../../../slices/storiesSlice';

function StoriesList() {
  const dispatch = useDispatch();

  const { otherStories } = useSelector((state) => state.stories);

  const handleOpenStory = (index) => {
    dispatch(setShowedStoryIndex(index));
  };

  return (
    <div className="relative mt-4 w-full">
      <div className="scrollable flex flex-row-reverse gap-3 overflow-x-scroll px-4 py-2">
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
