import { configureStore } from '@reduxjs/toolkit';

//import slices from './slices';

import authReducer from './slices/authSlice';
import darkReducer from './slices/darkModeSlice';
import sidebarReducer from './slices/sidebarSlice';
import storiesReducer from './slices/storiesSlice';
import chatsReducer from './slices/chatsSlice';

const store = configureStore({
  reducer: {
    //slices
    auth: authReducer,

    darkMode: darkReducer,
    sidebar: sidebarReducer,
    stories: storiesReducer,
    chats: chatsReducer,
  },
});

export default store;
