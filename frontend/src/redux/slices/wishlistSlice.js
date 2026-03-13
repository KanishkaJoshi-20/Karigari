import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    wishlistItems: JSON.parse(localStorage.getItem('wishlistItems')) || [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const existItem = state.wishlistItems.find((x) => x._id === product._id);

            if (existItem) {
                state.wishlistItems = state.wishlistItems.filter((x) => x._id !== product._id);
            } else {
                state.wishlistItems.push(product);
            }
            localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
        },
        clearWishlist: (state) => {
            state.wishlistItems = [];
            localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
        }
    }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
