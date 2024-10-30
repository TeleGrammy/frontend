import { useSelector } from 'react-redux';

import Header from '../leftSidebar/Header';
import CloseButton from './CloseButton';
import SelectedInfo from './SelectedInfo';
import MyStory from './MyStory';

import { IoAdd } from 'react-icons/io5';

function RightSidebar() {
  const { myStories } = useSelector((state) => state.stories);

  const handleAddStory = () => {};

  return (
    <div
      className="relative flex h-screen flex-col items-center overflow-y-auto bg-bg-primary"
      style={{ width: `25vw` }}
    >
      <Header className={'h-[3.4rem]'}>
        <CloseButton />
        <SelectedInfo />
      </Header>

      <div className="grid w-full grid-cols-3 gap-4 p-4">
        {myStories
          .filter((story) => Date.now() < new Date(story.expiresAt))
          .map((story, index) => (
            <MyStory key={index} story={story} index={index} />
          ))}
      </div>

      <button
        className="absolute bottom-4 right-4 rounded-full bg-bg-button p-2 text-text-primary shadow-lg hover:bg-bg-button-hover"
        onClick={handleAddStory}
      >
        <IoAdd className="text-2xl" />
      </button>
    </div>
  );
}

export default RightSidebar;
