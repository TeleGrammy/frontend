import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }) {},
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
