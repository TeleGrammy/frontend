import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openedChat: {
    id: '2',
    name: 'user2 ',
    type: 'User',
    description: 'hello',
    lastMessage: {
      sender: 'youssef',
      content: 'Remember to buy groceries!',
      timeStamp: '8:33 PM',
    },
    unreadCount: 0,
    picture: 'https://picsum.photos/seed/sports/50/50',
    isMuted: true,
  },
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setOpenedChat(state, action) {
      state.openedChat = action.payload;
    },
  },
});

export const { setOpenedChat } = chatsSlice.actions;

export default chatsSlice.reducer;
