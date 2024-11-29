import Searchbar from './Searchbar';
import Menu from './Menu';
import Header from './Header';
import Chats from './Chats';
import CreateButton from './CreateButton';
function ChatList() {
  return (
    <>
      {/* Sidebar */}
      <Header>
        <Menu />
        <Searchbar />
      </Header>
      <Chats />
      <CreateButton />
      {/* chats */}
      {/* component of users */}
    </>
  );
}

export default ChatList;
