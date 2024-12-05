import { useDispatch, useSelector } from 'react-redux';
import CloseButton from '../../../components/home/rightSidebar/CloseButton';
import {
  setMyStories,
  setShowedMyStoryIndex,
  setShowedOtherStoryIndex,
  setShowedOtherUserIndex,
} from '../../../slices/storiesSlice';
import Progressbar from './Progressbar';
import { useEffect, useState } from 'react';

import { FaEllipsisVertical, FaTrash } from 'react-icons/fa6';

const apiUrl = import.meta.env.VITE_API_URL;

function MediaShower({ medias, initialStoryIndex, profile }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isViewerListOpen, setIsViewerListOpen] = useState(false);

  const viewerIds = [
    ...new Set(
      medias.flatMap((story) => {
        if (story.viewers) {
          return Object.keys(story.viewers).map((viewerId) => viewerId);
        }
      }),
    ),
  ];

  const seen = viewerIds.includes(user._id);
  const storyCreator = profile.username === user.username;

  const handleCloseStory = () => {
    dispatch(setShowedMyStoryIndex(null));
    dispatch(setShowedOtherStoryIndex(null));
    dispatch(setShowedOtherUserIndex(null));
  };

  const handleSeen = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/user/stories/${medias[currentStoryIndex]._id}/view`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch stories.');
      } else {
        console.log('stories have been fetched successfully.');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleDeleteStory = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/user/stories/${medias[currentStoryIndex]._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch stories.');
      } else {
        console.log('stories have been fetched successfully.');
      }
      const data = await response.json();
      console.log(data);
      const updatedStories = stories.filter(
        (_, index) => index !== currentStoryIndex,
      );

      dispatch(setMyStories(updatedStories));

      handleCloseStory();
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

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
    if (!seen) handleSeen();
  }, [medias, currentStoryIndex]);

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
          className="absolute left-0 top-0 h-[80%] w-[30%]"
          onClick={(e) => {
            e.stopPropagation();
            handleGoBack();
          }}
        ></div>
        <div
          className="absolute right-0 top-0 h-[80%] w-[30%]"
          onClick={(e) => {
            e.stopPropagation();
            handleFinishTimer();
          }}
        ></div>
        <p
          className="mb-5 ml-4 cursor-pointer self-start text-lg font-bold text-text-secondary"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click event from propagating to the parent
            setIsViewerListOpen(!isViewerListOpen); // Toggle the viewer list
          }}
        >
          {viewerIds.length} views
        </p>
        <img
          className="absolute left-5 top-10 size-11 rounded-full"
          src={profile.picture}
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
        </div>
        {storyCreator && (
          <div
            className="absolute right-5 top-10 rounded-full p-2 text-text-primary duration-300 hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setIsOptionsOpen((isOptionsOpen) => !isOptionsOpen);
            }}
          >
            <FaEllipsisVertical />
          </div>
        )}
        {isOptionsOpen && (
          <div
            className={`absolute right-5 top-20 w-[50%] min-w-40 rounded-lg border border-border bg-bg-primary opacity-80 shadow-xl`}
          >
            <ul className="text-l flex w-full flex-col justify-start space-y-2 p-2">
              <li className="mx-2 rounded-lg hover:bg-bg-hover">
                <button
                  onClick={handleDeleteStory}
                  className="flex w-full flex-row items-center text-text-primary hover:text-gray-300"
                >
                  <FaTrash />
                  <span className="ml-4">Delete Story</span>
                </button>
              </li>
            </ul>
          </div>
        )}
        {isViewerListOpen && (
          <div className="absolute left-[-250px] top-0 h-full w-[200px] overflow-y-auto p-4 text-text-primary shadow-md">
            <h3 className="mb-4 text-lg font-bold">Viewers</h3>
            <ul>
              {Object.values(medias[currentStoryIndex].viewers || {}).map(
                (viewer, index) => (
                  <li key={index} className="mb-2">
                    <img
                      src={viewer.profile.picture || 'default-avatar.jpg'}
                      alt={viewer.profile.username}
                      className="mr-2 inline-block h-8 w-8 rounded-full"
                    />
                    {viewer.profile.username}
                  </li>
                ),
              )}
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
