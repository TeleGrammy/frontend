import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = import.meta.env.VITE_API_URL;
// Define the initial state

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  loading: false,
  isLogin: document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith('accessToken')),
  error: '',
};

// Create an async thunk for the login request
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ UUID, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UUID,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const user = data.data.updatedUser;
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }) {},
    logout(state) {
      localStorage.removeItem('user');
      state.user = null;
      state.isLogin = false;
    },
    loginWithCallback(state, { payload }) {
      state.user = payload.user;
      state.isLogin = true;

      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLogin = true;
        //save user and islogin in local storage
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLogin = false;
      });
  },
});

export const { login, logout, loginWithCallback } = authSlice.actions;

export default authSlice.reducer;
