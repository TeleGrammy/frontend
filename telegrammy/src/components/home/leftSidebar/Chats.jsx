import React from 'react';
import MuteIcon from '../../icons/MuteIcon'
const Chats = () => {
  const chats = [
    {
      id: "1",
      name: "user1",
      lastMessage: {
        sender: "user1",
        content: "Hey, how are you?",
        timeStamp: "9:45 PM",
      },
      unreadCount: 2,
      picture: "https://picsum.photos/50/50",
      isMuted: false,
    },
    {
      id: "2",
      name: "user2 ",
      lastMessage: {
        sender:"youssef",
        content: "Remember to buy groceries!",
        timeStamp: "8:33 PM",
      },
      unreadCount: 0,
      picture: "https://picsum.photos/seed/sports/50/50",
      isMuted: true,
    },
    {
      id: "3",
      name: "user3",
      lastMessage: {
        sender: "user3",
        content: "hiii",
        timeStamp: "9:35 PM",
      },
      unreadCount: 3,
      picture: "https://picsum.photos/seed/nature/50/50",
      isMuted: false,
    },
  ];

  return (
    <div className="flex flex-col bg-bg-primary text-white h-full overflow-y-auto w-full">
      <ul className="divide-y divide-gray-700">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center p-4 hover:bg-gray-700 transition w-full"
          >
            {/* Profile Picture */}
            <img
              src={chat.picture}
              alt={`${chat.name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Chat Details */}
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{chat.name}</h3>
                <span className="text-sm text-gray-400">{chat.lastMessage.timeStamp}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm truncate">
                  {chat.lastMessage.content}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
            {/* Muted Icon */}
            {chat.isMuted && (
              <div className="ml-2 text-gray-400">
               <MuteIcon/>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chats;
