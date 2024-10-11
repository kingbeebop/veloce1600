import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string; // Adjust according to your user model
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null; // To store error messages
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
};

// Define the login payload and response types
export interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Thunk for logging in
export const loginUser = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed'); // Get the error message from the server if available
      }

      const data: LoginResponse = await response.json();
      // Store tokens in local storage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

// Thunk for refreshing token
export const refreshToken = createAsyncThunk<{ accessToken: string; refreshToken: string }, void, { rejectValue: string }>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      return rejectWithValue('No refresh token available');
    }

    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token refresh failed');
      }

      const data = await response.json();
      // Update tokens in local storage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null; // Clear error on logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null; // Clear any previous error
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null; // Clear any previous error
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Login failed'; // Update error state
        console.error('Login error:', state.error);
      })
      .addCase(refreshToken.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Refresh token failed'; // Update error state
        console.error('Refresh error:', state.error);
      });
  },
});

// Export actions and selector
export const { logout } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
