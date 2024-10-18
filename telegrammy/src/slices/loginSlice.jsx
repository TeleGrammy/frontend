import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: {
      prepare() {
        // add parameters here
        return { payload: {} };
      },
      reducer(state, action) {
        state = action.payload;
      },
    },
  },
});

export const { login } = loginSlice.actions;

export default loginSlice.reducer;
