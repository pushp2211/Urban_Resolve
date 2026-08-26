import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/axios';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/profile', {
        skipAuthRedirect: true,
      });
      const currentUser = response.data?.data?.user;
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
        return currentUser;
      }
      return rejectWithValue('No user found');
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      const stored = getStoredUser();
      if (stored) {
        return stored;
      }
      return rejectWithValue(error.response?.data?.message || 'Authentication check failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      const accessToken = response.data?.data?.accessToken;
      const currentUser = response.data?.data?.user;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      return { user: currentUser, accessToken };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await apiClient.post('/logout');
  } catch (error) {
    console.error('Logout error on server:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    loading: true,
    authChecked: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.authChecked = true;
        state.user = null;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.user = null;
        state.error = action.payload || 'Login failed';
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true;
        state.error = null;
      });
  },
});

export const { setUser, clearAuthError, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
