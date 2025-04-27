// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCart = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    const parsed = JSON.parse(savedCart);
    // Ensure structure is correct
    return {
      items: parsed.items || [],
      restaurantId: parsed.restaurantId || null
    };
  }
  return { items: [], restaurantId: null };
};

const initialState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { restaurantId, menuItemId, name, price, quantity, imageUrl } = action.payload;

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        alert('You can only add items from one restaurant at a time. Please clear your cart first.');
        return;
      }

      if (!state.restaurantId) {
        state.restaurantId = restaurantId;
      }

      const existingItem = state.items.find(item => item.menuItemId === menuItemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ restaurantId, menuItemId, name, price, quantity, imageUrl });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.menuItemId !== action.payload);
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
    },

    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(item => item.menuItemId === menuItemId);
      if (item) {
        item.quantity = quantity;
      }
    }
  }
});

// 🔥 Sync to localStorage OUTSIDE Immer draft logic
const { reducer, actions } = cartSlice;

export const { addToCart, removeFromCart, clearCart, updateQuantity } = actions;

export const cartReducer = (state, action) => {
  const newState = reducer(state, action);
  localStorage.setItem('cart', JSON.stringify(newState));
  return newState;
};

export default cartReducer;
