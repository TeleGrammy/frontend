import React, { useState, useRef } from 'react';
import MuteIcon from '../../icons/MuteIcon';

const Chats = () => {
  // State to manage the context menu
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chatId: null });
  const contextMenuRef = useRef(null);

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
      name: "user2",
      lastMessage: {
        sender: "youssef",
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

  // Handle right-click to show context menu
  const handleContextMenu = (e, chatId) => {
    e.preventDefault();

    // Get container width and context menu width
    const containerWidth = e.target.closest('.chats-container').offsetWidth; // Assuming '.chats-container' is your container div
    const menuWidth = 200; // Set the context menu width (you can also calculate it dynamically if needed)

    // Calculate the x position, ensuring the menu doesn't go beyond the container
    const xPos = Math.min(e.pageX, containerWidth - menuWidth);

    // Set context menu position and visibility
    setContextMenu({
      visible: true,
      chatId: chatId,
      x: xPos,
      y: e.pageY,
    });
  };

  // Handle mute action
  const handleMute = (chatId, duration) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, isMuted: true, muteDuration: duration };
      }
      return chat;
    });
    // Assuming you have a state to update the chats
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Handle unmute action
  const handleUnmute = (chatId) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, isMuted: false, muteDuration: null };
      }
      return chat;
    });
    // Assuming you have a state to update the chats
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div className="chats-container flex flex-col bg-bg-primary text-white h-full overflow-y-auto w-full">
      <ul className="divide-y divide-gray-700">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center p-4 hover:bg-gray-700 transition w-full"
            onContextMenu={(e) => handleContextMenu(e, chat.id)} // Added right-click event handler
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
          className="absolute bg-gray-800 text-white rounded shadow-lg w-48 z-50"
          style={{
            top: contextMenu.y,
            left: contextMenu.x, // Positioned dynamically based on the calculated x position
          }}
        >
          <ul>
            {/* Render Mute or Unmute Options Dynamically */}
            {chats.find((chat) => chat.id === contextMenu.chatId)?.isMuted ? (
              <li
                className="p-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleUnmute(contextMenu.chatId)}
              >
                Unmute
              </li>
            ) : (
              <>
                <li
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleMute(contextMenu.chatId, 8 * 60 * 60 * 1000)} // 8 hours in ms
                >
                  Mute for 8 Hours
                </li>
                <li
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleMute(contextMenu.chatId, 7 * 24 * 60 * 60 * 1000)} // 7 days in ms
                >
                  Mute for 7 Days
                </li>
                <li
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleMute(contextMenu.chatId, null)} // Permanent mute
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
