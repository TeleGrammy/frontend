import { useDispatch } from 'react-redux';
import CloseButton from '../rightSidebar/CloseButton';
import { setShowedStoryIndex } from '../../../slices/storiesSlice';

function MediaShower({ media }) {
  const dispatch = useDispatch();
  const handleCloseStory = () => {
    dispatch(setShowedStoryIndex(null));
  };
  return (
    <div className="fixed z-10 flex h-screen w-screen items-center justify-around bg-bg-primary opacity-90">
      <div className="relative z-20 flex h-full w-[23%] flex-col items-start justify-around">
        <img className="mt-1 h-[89%] w-full rounded-xl" src={media.media} />
        <p className="mb-5 ml-4 text-lg font-bold text-text-secondary">
          {media.views} views
        </p>
        <div className="absolute left-14 top-6 text-base font-semibold text-text-primary">
          <p>
            Your story{' '}
            <span className="text-sm font-normal text-text-secondary">
              • 1/1
            </span>
          </p>
          <p>
            <span className="text-sm font-normal text-text-secondary">7h</span>
          </p>
        </div>
      </div>
      <div className="fixed right-3 top-3 z-20">
        <CloseButton handleClick={handleCloseStory} />
      </div>
    </div>
  );
}

export default MediaShower;
