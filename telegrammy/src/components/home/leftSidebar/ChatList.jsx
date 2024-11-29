import { useState } from 'react';

import Searchbar from './Searchbar';
import Menu from './Menu';
import Header from './Header';
import Chats from './Chats';
import CreateButton from './CreateButton';
import StoriesList from './StoriesList';

function ChatList() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <>
      {/* Sidebar */}
      <Header>
        <Menu />
        <Searchbar setSearchValue={setSearchValue} searchValue={searchValue} />
      </Header>
      <StoriesList />
      <Chats searchValue={searchValue} />
      <CreateButton />
      {/* chats */}
      {/* component of users */}
    </>
  );
}

export default ChatList;
