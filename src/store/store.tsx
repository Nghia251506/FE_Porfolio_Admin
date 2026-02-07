import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import techStackReducer from './slice/techStackSlice';
import mediaReducer from './slice/mediaSlice';
import projectReducer from './slice/projectSlice';
import certificateReducer from './slice/certificateSlice'
import dashboardReducer from './slice/dashboardSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    techStack: techStackReducer,
    media: mediaReducer,
    project: projectReducer,
    certificate: certificateReducer,
    dashboard:dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export Type để dùng cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;