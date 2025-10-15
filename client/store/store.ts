import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import planReducer from './planSlice'
export const store = configureStore({
  reducer: {
    auth:authReducer,
    plan:planReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
