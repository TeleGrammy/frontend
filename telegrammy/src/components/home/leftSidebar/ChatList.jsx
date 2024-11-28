import Searchbar from './Searchbar';
import Menu from './Menu';
import Header from './Header';
import Chats from './Chats';
function ChatList() {
  return (
    <>
      {/* Sidebar */}
      <Header>
        <Menu />
        <Searchbar />
      </Header>
      <Chats />
      {/* chats */}
      {/* component of users */}
    </>
  );
}

export default ChatList;
