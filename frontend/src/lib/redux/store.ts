import { configureStore } from "@reduxjs/toolkit";
import membersReducer from "./slices/membersSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    members: membersReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
