import { useState } from 'react';

import Searchbar from './Searchbar';
import Menu from './Menu';
import Header from './Header';
import Chats from './Chats';
import CreateButton from './CreateButton';
import StoriesList from './StoriesList';
import SearchNav from './SearchNav';
import Texts from './Texts';

function ChatList() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Chats');

  return (
    <>
      {/* Sidebar */}
      <Header className={'pt-5'}>
        <Menu />
        <Searchbar setSearchValue={setSearchValue} searchValue={searchValue} />
      </Header>
      <SearchNav
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <StoriesList />
      {((searchValue && selectedCategory === 'Chats') || !searchValue) && (
        <Chats searchValue={searchValue} />
      )}
      {searchValue && selectedCategory !== 'Chats' && (
        <Texts searchQuery={searchValue} selectedCategory={selectedCategory} />
      )}
      <CreateButton />
      {/* chats */}
      {/* component of users */}
    </>
  );
}

export default ChatList;
