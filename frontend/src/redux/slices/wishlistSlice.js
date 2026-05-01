import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/wishlist");
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Named toggleWishlist to avoid updating component imports!
export const toggleWishlist = createAsyncThunk(
    "wishlist/toggleWishlist",
    async (product, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            // Check if it exists in the Redux state
            const exists = state.wishlist.wishlistItems.find(x => x._id === product._id);

            if (exists) {
                await axiosInstance.delete(`/wishlist/${product._id}`);
                return { action: 'removed', product };
            } else {
                await axiosInstance.post("/wishlist", { productId: product._id });
                return { action: 'added', product };
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const initialState = {
    // Let the initial be empty. App.jsx or Navbar should call fetchWishlist on load
    wishlistItems: [],
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.wishlistItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                // The API returns [{ _id, user, product: {...} }]
                // We flatten it back to just [Product] so existing UI code works perfectly without rewrites.
                state.wishlistItems = action.payload.map(item => item.product).filter(Boolean);
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // OPTIMISTIC UPDATES: Update UI immediately before the network resolves!
            .addCase(toggleWishlist.pending, (state, action) => {
                const product = action.meta.arg;
                const exists = state.wishlistItems.find((x) => x._id === product._id);

                if (exists) {
                    state.wishlistItems = state.wishlistItems.filter((x) => x._id !== product._id);
                } else {
                    state.wishlistItems.push(product);
                }
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
