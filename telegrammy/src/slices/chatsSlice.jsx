import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openedChat: null,
  searchVisible: false,
  searchText: '',
  chats: [],
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
      console.log(state.chats, action.payload);
      state.chats = action.payload;
    },
  },
});

export const { setOpenedChat, setSearchVisible, setSearchText, setChats } =
  chatsSlice.actions;

export default chatsSlice.reducer;
