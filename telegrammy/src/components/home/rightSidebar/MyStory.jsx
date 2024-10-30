import { FaRegEye } from 'react-icons/fa';

function MyStory({ story, index, handleClick }) {
  return (
    <>
      <div className="relative" onClick={handleClick}>
        <div className="absolute bottom-0 left-0 flex select-none flex-row items-center p-1">
          <FaRegEye className="text-sm text-white" />
          <span className="ml-1 text-xs text-white">{story.views}</span>
        </div>
        <img
          src={story.media}
          alt={`Story ${index + 1}`}
          className="h-full w-full"
        />
      </div>
    </>
  );
}

export default MyStory;
