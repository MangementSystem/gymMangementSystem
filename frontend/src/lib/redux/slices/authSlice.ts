import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../api/authApi';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Hydrate from localStorage on startup
function getInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
  }
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('currentUser');
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as User;
      return {
        user,
        accessToken: token,
        refreshToken: localStorage.getItem('refreshToken'),
        isAuthenticated: true,
      };
    } catch {
      // fall through
    }
  }
  return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
}

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Store tokens and user in localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear tokens and user from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentOrganization');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
