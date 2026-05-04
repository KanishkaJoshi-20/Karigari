import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";
import { logout } from "./authSlice";

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  loading: false,
  error: null,
};

// Fetch user's cart from backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user) return [];

      const response = await axiosInstance.get(`/cart/${user._id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Add item to cart (backend + localStorage)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.post("/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Remove item from cart (backend + localStorage)
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (itemId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cart/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product); // product corresponds to product ID

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        localStorage.setItem("cartItems", JSON.stringify(action.payload));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existItem = state.cartItems.find((x) => x.product._id === newItem.product._id);

        if (existItem) {
          state.cartItems = state.cartItems.map((x) =>
            x.product._id === existItem.product._id ? newItem : x
          );
        } else {
          state.cartItems.push(newItem);
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (x) => x._id !== action.payload
        );
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(logout, (state) => {
        state.cartItems = [];
        localStorage.removeItem("cartItems");
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
