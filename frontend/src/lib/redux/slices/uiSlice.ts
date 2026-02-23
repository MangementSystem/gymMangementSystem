// store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  currentOrganization: number | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: number;
  }>;
}

const getInitialState = (): UiState => {
  if (typeof window === 'undefined') {
    return {
      sidebarOpen: true,
      theme: 'light',
      currentOrganization: null,
      notifications: [],
    };
  }

  const savedOrg = localStorage.getItem('currentOrganization');
  return {
    sidebarOpen: true,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    currentOrganization: savedOrg ? parseInt(savedOrg) : null,
    notifications: [],
  };
};

const initialState: UiState = getInitialState();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    setCurrentOrganization(state, action: PayloadAction<number | null>) {
      state.currentOrganization = action.payload;
      if (action.payload) {
        localStorage.setItem('currentOrganization', action.payload.toString());
      } else {
        localStorage.removeItem('currentOrganization');
      }
    },
    addNotification(
      state,
      action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp'>>,
    ) {
      state.notifications.push({
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setCurrentOrganization,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
export const selectCurrentOrganization = (state: { ui: UiState }) => state.ui.currentOrganization;
export const selectNotifications = (state: { ui: UiState }) => state.ui.notifications;
