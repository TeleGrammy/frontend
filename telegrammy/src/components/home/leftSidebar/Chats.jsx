import React from 'react';
import MuteIcon from '../../icons/MuteIcon';
import { useDispatch } from 'react-redux';
import { setOpenedChat } from '../../../slices/chatsSlice';
const Chats = () => {
  const dispatch = useDispatch();

  const chats = [
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

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-bg-primary text-white">
      <ul className="divide-y divide-gray-700">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex w-full items-center p-4 transition hover:bg-gray-700"
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
    </div>
  );
};

export default Chats;
