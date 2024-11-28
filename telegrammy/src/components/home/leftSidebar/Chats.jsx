import React, { useState, useRef, useEffect } from 'react';
import MuteIcon from '../../icons/MuteIcon';

const Chats = () => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chatId: null });
  const [chats, setChats] = useState([
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
  ]);

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
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, isMuted: true, muteDuration: duration };
      }
      return chat;
    });

    setChats(updatedChats);
    setContextMenu({ ...contextMenu, visible: false });
  };


  const handleUnmute = (chatId) => {
    const updatedChats = chats.map(chat => {
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
    <div ref={containerRef} className="chats-container flex flex-col bg-bg-primary text-white h-full overflow-y-auto w-full">
      <ul className="divide-y divide-gray-700">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center p-4 hover:bg-gray-700 transition w-full cursor-pointer"
            onContextMenu={(e) => handleContextMenu(e, chat.id)} 
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
            left: contextMenu.x, 
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
                  onClick={() => handleMute(contextMenu.chatId, 8 * 60 * 60 * 1000)} 
                >
                  Mute for 8 Hours
                </li>
                <li
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleMute(contextMenu.chatId, 7 * 24 * 60 * 60 * 1000)} 
                >
                  Mute for 7 Days
                </li>
                <li
                  className="p-2 hover:bg-gray-700 cursor-pointer"
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
