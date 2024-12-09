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
  userId: localStorage.getItem('userId') || '', // Initialize userId from localStorage
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      const user = data.data.updatedUser;
      return user; // Return the full user object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('user');
      localStorage.removeItem('userId'); // Clear userId from localStorage
      state.user = null;
      state.userId = '';
      state.isLogin = false;
    },
    loginWithCallback(state, action) {
      state.user = action.payload.user;
      state.userId = action.payload.user.id; // Assuming `id` is the user ID
      state.isLogin = true;

      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('userId', state.userId); // Save userId in localStorage
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
        state.userId = action.payload.id; // Assuming `id` is the user ID
        state.isLogin = true;

        // Save user and userId in localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('userId', state.userId);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLogin = false;
      });
  },
});

export const { logout, loginWithCallback } = authSlice.actions;

export default authSlice.reducer;
