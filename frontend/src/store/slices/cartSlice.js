import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice'; // 👈 Import logout action to listen inside extraReducers

// Load cart from localStorage based on userId
const loadCart = (userId) => {
  if (!userId) return { items: [], restaurantId: null };
  const savedCart = localStorage.getItem(`cart_${userId}`);
  if (savedCart) {
    const parsed = JSON.parse(savedCart);
    return {
      items: parsed.items || [],
      restaurantId: parsed.restaurantId || null,
    };
  }
  return { items: [], restaurantId: null };
};

// Initial cart is empty — user not known yet
const initialState = {
  items: [],
  restaurantId: null,
  userId: null, // track user
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCartForUser: (state, action) => {
      const userId = action.payload;
      const loadedCart = loadCart(userId);
      state.items = loadedCart.items;
      state.restaurantId = loadedCart.restaurantId;
      state.userId = userId;
    },

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
      if (state.userId) {
        localStorage.removeItem(`cart_${state.userId}`);
      }
    },

    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(item => item.menuItemId === menuItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
  },

  // reducer to listen for logout
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.items = [];
      state.restaurantId = null;
      if (state.userId) {
        localStorage.removeItem(`cart_${state.userId}`);
      }
      state.userId = null; // clear user tracking
    });
  }
});

// Manual reducer to sync after every change
const { reducer, actions } = cartSlice;

export const { initializeCartForUser, addToCart, removeFromCart, clearCart, updateQuantity } = actions;

export const cartReducer = (state, action) => {
  const newState = reducer(state, action);

  if (newState.userId) {
    localStorage.setItem(`cart_${newState.userId}`, JSON.stringify({
      items: newState.items,
      restaurantId: newState.restaurantId
    }));
  }

  return newState;
};

export default cartReducer;
