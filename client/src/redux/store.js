import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import loadingReducer from './slices/loadingSlice';
import filterReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    loading: loadingReducer,
    filter: filterReducer,
  },
});

export default store;
