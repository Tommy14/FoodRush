// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCart = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.menuItemId === action.payload.menuItemId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.menuItemId !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(item => item.menuItemId === menuItemId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    }
  }
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
