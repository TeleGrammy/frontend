import Searchbar from './Searchbar';
import Menu from './Menu';
import Header from './Header';
import StoriesList from './StoriesList';

function ChatList() {
  return (
    <>
      {/* Sidebar */}
      <Header>
        <Menu />
        <Searchbar />
      </Header>
      <StoriesList />
      {/* chats */}
      {/* component of users */}
    </>
  );
}

export default ChatList;
