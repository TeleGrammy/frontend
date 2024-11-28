import Searchbar from './Searchbar';
import Menu from './Menu';
import Header from './Header';
import CreateButton from './CreateButton';

function ChatList() {
  return (
    <>
      {/* Sidebar */}
      <Header>
        <Menu />
        <Searchbar />
      </Header>

      <CreateButton />
      {/* chats */}
      {/* component of users */}
    </>
  );
}

export default ChatList;
