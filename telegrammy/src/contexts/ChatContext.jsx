import React, { createContext, useState, useContext } from 'react';

const ChatsContext = createContext();

export const useChats = () => useContext(ChatsContext);

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  return (
    <ChatsContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatsContext.Provider>
  );
};
