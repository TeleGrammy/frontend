import { useDispatch } from 'react-redux';
import CloseButton from '../rightSidebar/CloseButton';
import { setShowedStoryIndex } from '../../../slices/storiesSlice';
import Progressbar from './Progressbar';
import { useState } from 'react';

function MediaShower({ medias, initialStoryIndex }) {
  const dispatch = useDispatch();

  const handleCloseStory = () => {
    dispatch(setShowedStoryIndex(null));
  };

  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);

  const handleFinishTimer = () => {
    if (currentStoryIndex < medias.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      handleCloseStory();
    }
  };

  return (
    <div
      className="fixed z-10 flex h-screen w-screen items-center justify-around bg-bg-primary opacity-90"
      onClick={handleCloseStory}
    >
      <div
        className="relative z-20 flex h-full w-[23%] flex-col items-center justify-around"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative top-6 flex h-1 w-[90%] justify-around">
          {medias.map((media, index) => (
            <Progressbar
              key={index}
              duration={media.duration}
              count={medias.length}
              isActive={currentStoryIndex === index}
              isCompleted={currentStoryIndex > index}
              handleEnd={handleFinishTimer}
            />
          ))}
        </div>
        <img
          className="mt-1 h-[89%] w-full rounded-xl"
          src={medias[currentStoryIndex].media}
        />
        <p className="mb-5 ml-4 self-start text-lg font-bold text-text-secondary">
          {medias[currentStoryIndex].views} views
        </p>
        <div className="absolute left-14 top-9 text-base font-semibold text-text-primary">
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
        <div className="absolute bottom-20 left-4 text-base font-semibold text-text-primary">
          <p>{medias[currentStoryIndex].content}</p>
        </div>
      </div>
      <div className="fixed right-3 top-3 z-20">
        <CloseButton handleClick={handleCloseStory} />
      </div>
    </div>
  );
}

export default MediaShower;
