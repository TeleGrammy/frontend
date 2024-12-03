import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MuteIcon from '../../icons/MuteIcon';

import { setOpenedChat } from '../../../slices/chatsSlice';
import { initialChatsLSB } from '../../../mocks/mockDataChatList';
const apiUrl = import.meta.env.VITE_API_URL;

const Chats = ({ searchValue }) => {
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);
  const [ViewedChats, setViewedChats] = useState(chats);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    chatId: null,
  });
  const contextMenuRef = useRef(null);
  const containerRef = useRef(null);

  const handleClickChat = (chat) => {
    dispatch(setOpenedChat(chat));
  };

  const handleContextMenu = (e, chatId) => {
    e.preventDefault();

    const containerWidth = e.target.closest(
      '.ViewedChats-container',
    ).offsetWidth;
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
    const updatedChats = ViewedChats.map((chat) => {
      if (chat._id === chatId) {
        return { ...chat, isMuted: true, muteDuration: duration };
      }
      return chat;
    });

    setViewedChats(updatedChats);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleUnmute = (chatId) => {
    const updatedChats = ViewedChats.map((chat) => {
      if (chat._id === chatId) {
        return { ...chat, isMuted: false, muteDuration: null };
      }
      return chat;
    });

    setViewedChats(updatedChats);
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

  useEffect(() => {
    if (searchValue) {
      const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setViewedChats(filteredChats);
    } else {
      setViewedChats(chats);
    }
  }, [searchValue, chats]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/chats/all-chats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Failed to fetch chats.');
        } else {
          console.log('Chats have been fetched successfully.');
        }
        const data = await response.json();
        console.log(data);
        setChats(data.chats);
        // setChats(data.data.chats);
      } catch (error) {
        console.error('Error fetching Chats:', error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div
      ref={containerRef}
      className="ViewedChats-container flex h-full w-full flex-col overflow-y-auto bg-bg-primary text-white"
      data-test-id="viewed-chats-container"
    >
      <ul className="divide-y divide-gray-700" data-test-id="chats-list">
        {ViewedChats.map((chat) => (
          <li
            key={chat._id}
            className="flex w-full cursor-pointer items-center p-4 transition hover:bg-gray-700"
            onContextMenu={(e) => handleContextMenu(e, chat._id)}
            onClick={() => handleClickChat(chat)}
            data-test-id={`chat-item-${chat._id}`}
          >
            {/* Profile Picture */}
            <img
              src={
                chat.participants[1].userId.picture
                  ? chat.participants[1].userId.picture
                  : 'https://ui-avatars.com/api/?name=' +
                    chat.participants[1].userId.username
              }
              alt={`${chat.participants[1].userId.username}'s avatar`}
              className="h-12 w-12 rounded-full object-cover"
              data-test-id={`chat-avatar-${chat._id}`}
            />
            {/* Chat Details */}
            <div
              className="ml-4 flex-1"
              data-test-id={`chat-details-${chat._id}`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="truncate font-semibold"
                  data-test-id={`chat-name-${chat._id}`}
                >
                  {chat.participants[1].userId.username}
                </h3>
                <span
                  className="text-sm text-gray-400"
                  data-test-id={`chat-timestamp-${chat._id}`}
                >
                  Last Seen {chat.participants[1].userId.lastSeen}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className="truncate text-sm text-gray-400"
                  data-test-id={`chat-message-${chat._id}`}
                >
                  {chat.lastMessage
                    ? chat.lastMessage.content
                    : 'Hey there! Are you using Telegrammy?'}
                </p>
                {chat.unreadCount > 0 && (
                  <span
                    className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                    data-test-id={`chat-unread-${chat._id}`}
                  >
                    {/* {chat.unreadCount} */}3
                  </span>
                )}
              </div>
            </div>
            {/* Muted Icon */}
            {chat.isMuted && (
              <div
                className="ml-2 text-gray-400"
                data-test-id={`chat-muted-icon-${chat._id}`}
              >
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
          data-test-id="context-menu"
        >
          <ul>
            {ViewedChats.find((chat) => chat._id === contextMenu.chatId)
              ?.isMuted ? (
              <li
                className="cursor-pointer p-2 hover:bg-gray-700"
                onClick={() => handleUnmute(contextMenu.chatId)}
                data-test-id="context-unmute"
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
                  data-test-id="context-mute-8h"
                >
                  Mute for 8 Hours
                </li>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-700"
                  onClick={() =>
                    handleMute(contextMenu.chatId, 7 * 24 * 60 * 60 * 1000)
                  }
                  data-test-id="context-mute-7d"
                >
                  Mute for 7 Days
                </li>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-700"
                  onClick={() => handleMute(contextMenu.chatId, null)}
                  data-test-id="context-mute-permanent"
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
