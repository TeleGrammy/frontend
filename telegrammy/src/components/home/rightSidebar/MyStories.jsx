import { useSelector } from 'react-redux';

import Header from '../leftSidebar/Header';
import CloseButton from './CloseButton';
import SelectedInfo from './SelectedInfo';
import MyStory from './MyStory';

import AddStory from './AddStory';

function MyStories() {
  const { myStories } = useSelector((state) => state.stories);

  return (
    <>
      {/* Header info */}
      <Header className={'h-[3.4rem]'}>
        <CloseButton />
        <SelectedInfo />
      </Header>

      {/* My Stories */}
      <div className="grid w-full grid-cols-3 gap-4 p-4">
        {myStories
          .filter((story) => Date.now() < new Date(story.expiresAt))
          .map((story, index) => (
            <MyStory key={index} story={story} index={index} />
          ))}
      </div>

      {/* Add Story Button and logic for add story */}
      <AddStory />
    </>
  );
}

export default MyStories;
