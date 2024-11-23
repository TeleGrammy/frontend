import { useDispatch, useSelector } from 'react-redux';

import Header from '../leftSidebar/Header';
import CloseButton from './CloseButton';
import SelectedInfo from './SelectedInfo';
import MyStory from './MyStory';

import AddStory from './AddStory';
import { IoAdd } from 'react-icons/io5';
import { closeRightSidebar } from '../../../slices/sidebarSlice';
import { setShowedMyStoryIndex } from '../../../slices/storiesSlice';

function RightSidebar() {
  const { myStories } = useSelector((state) => state.stories);

  const handleOpenStory = (index) => {
    dispatch(setShowedMyStoryIndex(index));
  };

  const dispatch = useDispatch();

  return (
    <div
      className="relative flex h-screen flex-col items-center overflow-y-auto bg-bg-primary"
      style={{ width: `25vw` }}
    >
      {/* Header info */}
      <Header className={'h-[3.4rem]'}>
        <CloseButton handleClick={() => dispatch(closeRightSidebar())} />
        <SelectedInfo />
      </Header>

      {/* My Stories */}
      <div className="grid w-full grid-cols-3 gap-4 p-4">
        {myStories
          .filter((story) => Date.now() < new Date(story.expiresAt))
          .map((story, index) => (
            <MyStory
              key={index}
              story={story}
              index={index}
              handleClick={() => handleOpenStory(index)}
            />
          ))}
      </div>

      {/* Add Story Button and logic for add story */}
      <AddStory />
    </div>
  );
}

export default RightSidebar;
