import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = import.meta.env.VITE_API_URL;
// Define the initial state
const initialState = {
  user: null,
  loading: false,
  isLogin: false,
  error: '',
};

// Create an async thunk for the login request
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ UUID, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/v1/auth/login`, {
        method: 'POST',
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
      console.log(data);

      const clearTokenFromCookie = () => {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict';
      };

      const setTokenInCookie = (token) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

        document.cookie = `accessToken=${token}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
      };
      const token = data.data.accessToken;
      const user = data.data.updatedUser;
      clearTokenFromCookie();
      setTokenInCookie(token);
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
