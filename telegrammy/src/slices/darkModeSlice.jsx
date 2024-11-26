import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkTheme: JSON.parse(localStorage.getItem('isDarkTheme')) || false,
};

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    ToggleDarkMode(state) {
      state.isDarkTheme = !state.isDarkTheme;
      // Save the updated state to local storage
      localStorage.setItem('isDarkTheme', JSON.stringify(state.isDarkTheme));
    },
  },
});

export const { ToggleDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
