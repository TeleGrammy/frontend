import React, { useState, useRef, useEffect } from 'react';
import MuteIcon from '../../icons/MuteIcon';
import { useDispatch } from 'react-redux';
import { setOpenedChat } from '../../../slices/chatsSlice';
const Chats = () => {
  const dispatch = useDispatch();

  const initialChats = [
    {
      id: '1',
      name: 'user1',
      type: 'Group',
      lastMessage: {
        sender: 'user1',
        content: 'Hey, how are you?',
        timeStamp: '9:45 PM',
      },
      unreadCount: 2,
      picture: 'https://picsum.photos/50/50',
      isMuted: false,
    },
    {
      id: '2',
      name: 'user2 ',
      type: 'User',
      lastMessage: {
        sender: 'youssef',
        content: 'Remember to buy groceries!',
        timeStamp: '8:33 PM',
      },
      unreadCount: 0,
      picture: 'https://picsum.photos/seed/sports/50/50',
      isMuted: true,
    },
    {
      id: '3',
      name: 'user3',
      type: 'User',
      lastMessage: {
        sender: 'user3',
        content: 'hiii',
        timeStamp: '9:35 PM',
      },
      unreadCount: 3,
      picture: 'https://picsum.photos/seed/nature/50/50',
      isMuted: false,
    },
    {
      id: '4',
      name: 'My Channel',
      type: 'Channel',
      lastMessage: {
        sender: 'user3',
        content: 'hiii',
        timeStamp: '9:35 PM',
      },
      unreadCount: 3,
      picture: 'https://picsum.photos/seed/nature/50/50',
      isMuted: false,
    },
  ];

  const handleClickChat = (chat) => {
    dispatch(setOpenedChat(chat));
  };

  const [chats, setChats] = useState(initialChats);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    chatId: null,
  });
  const contextMenuRef = useRef(null);
  const containerRef = useRef(null);

  const handleContextMenu = (e, chatId) => {
    e.preventDefault();

    const containerWidth = e.target.closest('.chats-container').offsetWidth;
    const menuWidth = 200;

    const xPos = Math.min(e.pageX, containerWidth - menuWidth);

    setContextMenu({
      visible: true,
      chatId: chatId,
      x: xPos,
      y: e.pageY,
    });
  };

  const handleMute = (chatId, duration) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, isMuted: true, muteDuration: duration };
      }
      return chat;
    });

    setChats(updatedChats);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleUnmute = (chatId) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, isMuted: false, muteDuration: null };
      }
      return chat;
    });

    setChats(updatedChats);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleClickOutside = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const handleClickInside = (e) => {
    if (contextMenu.visible && containerRef.current.contains(e.target)) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickInside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('click', handleClickInside);
    };
  }, [contextMenu]);
  return (
    <div
      ref={containerRef}
      className="chats-container flex h-full w-full flex-col overflow-y-auto bg-bg-primary text-white"
    >
      <ul className="divide-y divide-gray-700">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex w-full cursor-pointer items-center p-4 transition hover:bg-gray-700"
            onContextMenu={(e) => handleContextMenu(e, chat.id)}
            onClick={() => handleClickChat(chat)}
          >
            {/* Profile Picture */}
            <img
              src={chat.picture}
              alt={`${chat.name}'s avatar`}
              className="h-12 w-12 rounded-full object-cover"
            />
            {/* Chat Details */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="truncate font-semibold">{chat.name}</h3>
                <span className="text-sm text-gray-400">
                  {chat.lastMessage.timeStamp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm text-gray-400">
                  {chat.lastMessage.content}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
            {/* Muted Icon */}
            {chat.isMuted && (
              <div className="ml-2 text-gray-400">
                <MuteIcon />
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="absolute z-50 w-48 rounded bg-gray-800 text-white shadow-lg"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <ul>
            {/* Render Mute or Unmute Options Dynamically */}
            {chats.find((chat) => chat.id === contextMenu.chatId)?.isMuted ? (
              <li
                className="cursor-pointer p-2 hover:bg-gray-700"
                onClick={() => handleUnmute(contextMenu.chatId)}
              >
                Unmute
              </li>
            ) : (
              <>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-700"
                  onClick={() =>
                    handleMute(contextMenu.chatId, 8 * 60 * 60 * 1000)
                  }
                >
                  Mute for 8 Hours
                </li>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-700"
                  onClick={() =>
                    handleMute(contextMenu.chatId, 7 * 24 * 60 * 60 * 1000)
                  }
                >
                  Mute for 7 Days
                </li>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-700"
                  onClick={() => handleMute(contextMenu.chatId, null)}
                >
                  Mute Permanently
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Chats;
