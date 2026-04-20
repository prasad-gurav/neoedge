import { configureStore } from '@reduxjs/toolkit';
import { neoedgeApi } from './api/neoedgeApi';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    [neoedgeApi.reducerPath]: neoedgeApi.reducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(neoedgeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
