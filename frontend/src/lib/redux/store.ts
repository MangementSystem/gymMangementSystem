// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import uiReducer from "./slices/uiSlice";
import { membersApi } from "../api/membersApi";
import { organizationsApi } from "../api/organizationsApi";
import { plansApi } from "../api/plansApi";
import { membershipsApi } from "../api/membershipsApi";
import { attendanceApi } from "../api/attendanceApi";
import { workoutProgramsApi } from "../api/workoutProgramsApi";
import { workoutLogsApi } from "../api/workoutLogsApi";
import { exercisesApi } from "../api/exercisesApi";
import { progressApi } from "../api/progressApi";
import { transactionsApi } from "../api/transactionsApi";
import { aiApi } from "../api/aiApi";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [organizationsApi.reducerPath]: organizationsApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [membershipsApi.reducerPath]: membershipsApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [workoutProgramsApi.reducerPath]: workoutProgramsApi.reducer,
    [workoutLogsApi.reducerPath]: workoutLogsApi.reducer,
    [exercisesApi.reducerPath]: exercisesApi.reducer,
    [progressApi.reducerPath]: progressApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      membersApi.middleware,
      organizationsApi.middleware,
      plansApi.middleware,
      membershipsApi.middleware,
      attendanceApi.middleware,
      workoutProgramsApi.middleware,
      workoutLogsApi.middleware,
      exercisesApi.middleware,
      progressApi.middleware,
      transactionsApi.middleware,
      aiApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;