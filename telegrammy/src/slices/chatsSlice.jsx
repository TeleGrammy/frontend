import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openedChat: null,
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
  },
});

export const { setOpenedChat, setSearchVisible, setSearchText } =
  chatsSlice.actions;

export default chatsSlice.reducer;
