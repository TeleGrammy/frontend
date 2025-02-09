import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Resizer from './Resizer';
import ChatList from './ChatList';
import Settings from '../../../components/Settings/Settings';
import ChannelList from './ChannelList';
import ContactList from './ContactList';
const minWidth = 300; // Minimum sidebar width
const maxWidth = 600; // Maximum sidebar width

const SideBar = () => {
  const [width, setWidth] = useState(minWidth); // Initial width of the sidebar

  const { currentMenu } = useSelector((state) => state.sidebar);

  return (
    <div
      className="no-scrollbar relative flex h-screen flex-col items-center bg-bg-primary"
      style={{ width: `${width}px` }}
    >
      {/* Components to render */}
      {/* ChatList component */}
      {currentMenu === 'ChatList' && <ChatList />}

      {/** setting component */}
      {currentMenu === 'Setting' && <Settings />}
      {currentMenu === 'ChannelList' && (
        <ChannelList channelOrGroup="channel" />
      )}
      {currentMenu === 'GroupList' && <ChannelList channelOrGroup="group" />}
      {currentMenu === 'ContactList' && <ContactList />}
      {/* {currentMenu === 'EditSettings' && <EditSettings />}*/}
      {/* Resizer handle */}
      <Resizer setWidth={setWidth} />
    </div>
  );
};

export default SideBar;
