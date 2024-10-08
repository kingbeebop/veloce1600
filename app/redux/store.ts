import { configureStore } from '@reduxjs/toolkit';
import carReducer from './slices/carSlice';
import ownerReducer from './slices/ownerSlice'; // New owner slice
import saleReducer from './slices/saleSlice'; // New sale slice
import { RootState } from '../types/redux/types'; // Ensure this path is correct

const store = configureStore({
  reducer: {
    cars: carReducer, // Car state
    owners: ownerReducer, // Owner state
    sales: saleReducer, // Sale state
  },
  // Enable Redux DevTools extension if installed
  devTools: process.env.NODE_ENV !== 'production',
});

// Define types for RootState and AppDispatch
export type AppDispatch = typeof store.dispatch;

// Optional: You can include a custom thunk type if you need to specify extra configurations in your thunks
export interface AsyncThunkConfig {
  state: RootState;
  // Add any additional properties here if needed
}

export default store;
