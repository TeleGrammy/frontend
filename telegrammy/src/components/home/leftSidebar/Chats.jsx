import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MuteIcon from '../../icons/MuteIcon';
import { setOpenedChat, setChats } from '../../../slices/chatsSlice';
const apiUrl = import.meta.env.VITE_API_URL;
const userId = JSON.parse(localStorage.getItem('user'))?.id;
const Chats = ({ searchValue }) => {
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chats);
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
    console.log('Chat clicked:', chat);
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

  const handleMute = async (chatId, duration) => {
    try {
      const response = await fetch(`${apiUrl}/v1/notification/mute`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
        }),
        credentials: 'include',
      });

      const updatedChats = ViewedChats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, isMuted: true, muteDuration: duration };
        }
        return chat;
      });
      setViewedChats(updatedChats);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error muting chat:', error);
    }

    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleUnmute = async (chatId) => {
    try {
      const response = await fetch(`${apiUrl}/v1/notification/unmute`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
        }),
        credentials: 'include',
      });

      const updatedChats = ViewedChats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, isMuted: false, muteDuration: null };
        }
        return chat;
      });

      setViewedChats(updatedChats);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error muting chat:', error);
    }
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

  const DATE_OPTIONS = Object.freeze({
    TODAY: {
      hour: '2-digit',
      minute: '2-digit',
    },
    YESTERDAY: 'YESTERDAY',
    DEFAULT: {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  });

  const getDateOptions = (timestamp) => {
    const givenDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const compareDate = (givenDate, comparedDay) => {
      return (
        givenDate.getFullYear() === comparedDay.getFullYear() &&
        givenDate.getMonth() === comparedDay.getMonth() &&
        givenDate.getDate() === comparedDay.getDate()
      );
    };
    // Compare the date parts
    if (compareDate(givenDate, today)) {
      return DATE_OPTIONS.TODAY;
    } else if (compareDate(givenDate, yesterday)) {
      return DATE_OPTIONS.YESTERDAY;
    } else return DATE_OPTIONS.DEFAULT;
  };

  const formatTimeStamp = (timestamp) => {
    const options = getDateOptions(timestamp);
    if (options === DATE_OPTIONS.YESTERDAY) return 'Yesterday';
    if (options === DATE_OPTIONS.TODAY)
      return new Date(timestamp).toLocaleTimeString('en-US', options);
    return new Date(timestamp).toLocaleDateString('en-US', options);
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
        console.log(data.chats);
        dispatch(setChats(data.chats));
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
      className="scrollable ViewedChats-container overflow-x-hiddenbg-bg-primary flex h-full w-full flex-col overflow-y-auto text-white"
      data-test-id="viewed-chats-container"
    >
      <ul className="divide-y divide-gray-700" data-test-id="chats-list">
        {ViewedChats &&
          ViewedChats.map((chat) => {
            return (
              <li
                key={chat.id}
                className="flex w-full cursor-pointer items-center p-4 transition hover:bg-gray-700"
                onContextMenu={(e) => handleContextMenu(e, chat.id)}
                onClick={() => handleClickChat(chat)}
                data-test-id={`chat-item-${chat.id}`}
              >
                {/* Profile Picture */}
                <img
                  src={
                    chat.photo
                      ? chat.photo
                      : 'https://ui-avatars.com/api/?name=' + chat.name
                  }
                  alt={`${chat.name}'s avatar`}
                  className="h-12 w-12 rounded-full object-cover"
                  data-test-id={`chat-avatar-${chat.id}`}
                />
                {/* Chat Details */}
                <div
                  className="ml-4 flex-1"
                  data-test-id={`chat-details-${chat.id}`}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="truncate font-semibold"
                      data-test-id={`chat-name-${chat.id}`}
                    >
                      {chat.name}
                    </h3>
                    <span
                      className="text-sm text-gray-400"
                      data-test-id={`chat-timestamp-${chat.id}`}
                    >
                      Last Seen {chat.lastSeen}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className="truncate text-sm text-gray-400"
                      data-test-id={`chat-message-${chat.id}`}
                    >
                      {chat.lastMessage
                        ? chat.lastMessage.content
                        : 'Hey there! Are you using Telegrammy?'}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span
                        className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                        data-test-id={`chat-unread-${chat.id}`}
                      >
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                {/* Muted Icon */}
                {chat.isMuted && (
                  <div
                    className="ml-2 text-gray-400"
                    data-test-id={`chat-muted-icon-${chat.id}`}
                  >
                    <MuteIcon />
                  </div>
                )}
              </li>
            );
          })}
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
            {ViewedChats.find((chat) => chat.id === contextMenu.chatId)
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
