import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openedChat: {
    id: '2',
    name: 'user2',
    type: 'User',
    description: 'hello',
    lastMessage: {
      sender: 'youssef',
      content: 'Hi',
      timeStamp: '8:33 PM',
    },
    unreadCount: 0,
    picture: 'https://picsum.photos/seed/sports/50/50',
    isMuted: true,
  },
  chats: [],
  searchVisible: false,
  searchText: '',
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setOpenedChat(state, action) {
      state.openedChat = action.payload;
    },
    setSearchVisible(state, action) {
      state.searchVisible = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
  },
});

export const { setOpenedChat, setSearchVisible, setSearchText, setChats } =
  chatsSlice.actions;

export default chatsSlice.reducer;
