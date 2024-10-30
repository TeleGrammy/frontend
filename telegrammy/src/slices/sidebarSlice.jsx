import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentMenu: 'ChatList',
  isRightSidebarOpen: false,
  currentRightSidebar: '',
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setcurrentMenu(state, action) {
      state.currentMenu = action.payload;
    },

    setRightSidebar(state, action) {
      state.isRightSidebarOpen = true;
      state.currentRightSidebar = action.payload;
    },

    closeRightSidebar(state) {
      state.isRightSidebarOpen = false;
      state.currentRightSidebar = '';
    },
  },
});

export const { setcurrentMenu, setRightSidebar, closeRightSidebar } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
