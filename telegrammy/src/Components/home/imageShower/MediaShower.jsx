import { useDispatch, useSelector } from 'react-redux';
import CloseButton from '../../../components/home/rightSidebar/CloseButton';
import {
  setShowedMyStoryIndex,
  setShowedOtherStoryIndex,
  setShowedOtherUserIndex,
} from '../../../slices/storiesSlice';
import Progressbar from './Progressbar';
import { useEffect, useState } from 'react';

import { FaEllipsisVertical, FaTrash } from 'react-icons/fa6';

function MediaShower({ medias, initialStoryIndex, profile }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleCloseStory = () => {
    dispatch(setShowedMyStoryIndex(null));
    dispatch(setShowedOtherStoryIndex(null));
    dispatch(setShowedOtherUserIndex(null));
  };

  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleFinishTimer = () => {
    if (currentStoryIndex < medias.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      handleCloseStory();
    }
  };

  const handleGoBack = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      handleCloseStory();
    }
  };

  useEffect(() => {
    console.log('3mnaaaa', medias[currentStoryIndex].media);
  }, []);

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
              duration={10}
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
          alt={medias[currentStoryIndex].content}
        />
        <div
          className="absolute left-0 top-0 h-full w-[30%]"
          onClick={(e) => {
            handleGoBack();
          }}
        ></div>
        <div
          className="absolute right-0 top-0 h-full w-[30%]"
          onClick={(e) => {
            handleFinishTimer();
          }}
        ></div>
        <p className="mb-5 ml-4 self-start text-lg font-bold text-text-secondary">
          {medias[currentStoryIndex].viewersCount
            ? medias[currentStoryIndex].viewersCount
            : 0}{' '}
          views
        </p>
        <img
          className="absolute left-5 top-9 size-11 rounded-full"
          src="anonymous.png"
        />
        <div className="absolute left-20 top-9 text-base font-semibold text-text-primary">
          <p>
            {/* {user._id === medias[currentStoryIndex].userId
              ? 'Your story'
              : medias[currentStoryIndex].username} */}
            <span className="text-sm font-normal text-text-primary">
              • {currentStoryIndex + 1} / {medias.length}
            </span>
          </p>
          <p>
            <span className="text-sm font-normal text-text-secondary">7h</span>
          </p>
        </div>
        <div
          className="absolute right-5 top-10 rounded-full p-2 text-text-primary duration-300 hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setIsOptionsOpen((isOptionsOpen) => !isOptionsOpen);
          }}
        >
          <FaEllipsisVertical />
        </div>

        {isOptionsOpen && (
          <div
            className={`absolute right-5 top-20 w-[50%] min-w-40 rounded-lg border border-border bg-bg-primary opacity-80 shadow-xl`}
          >
            <ul className="text-l flex w-full flex-col justify-start space-y-2 p-2">
              <li className="mx-2 rounded-lg hover:bg-bg-hover">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    /*deleteMyStory*/
                  }}
                  className="flex w-full flex-row items-center text-text-primary hover:text-gray-300"
                >
                  <FaTrash />
                  <span className="ml-4">Delete Story</span>
                </button>
              </li>
            </ul>
          </div>
        )}

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
