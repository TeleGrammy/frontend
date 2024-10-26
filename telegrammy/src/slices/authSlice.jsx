import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }) {},
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
