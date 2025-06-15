import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice'
import categoriesSlice from './slices/categoriesSlice';
import productsSlice from './slices/productsSlice';
import cartSlice from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesSlice,
    products: productsSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;