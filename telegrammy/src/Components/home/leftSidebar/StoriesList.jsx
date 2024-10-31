import { useDispatch, useSelector } from 'react-redux';

function StoriesList() {
  const dispatch = useDispatch();

  const { otherStories, setShowedStoryIndex } = useSelector(
    (state) => state.stories,
  );

  const handleOpenStory = (index) => {
    dispatch(setShowedStoryIndex(index));
  };

  return (
    <div className="mt-4 flex w-full items-center justify-end">
      {otherStories
        .filter((story) => Date.now() < new Date(story.expiresAt))
        .map((story, index) => (
          <div
            key={index}
            className="mr-4"
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
  );
}

export default StoriesList;
