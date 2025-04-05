import { createSlice } from "@reduxjs/toolkit";
import { fetchAllVegetables, fetchFavoriteVegetables } from "../actions/vegesAction";

const vegetableSlice = createSlice({
    name: 'vegetables',
    initialState: {
        all: [],
        favorites: [],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // All vegetables
            .addCase(fetchAllVegetables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllVegetables.fulfilled, (state, action) => {
                state.loading = false;
                state.all = action.payload;
            })
            .addCase(fetchAllVegetables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string | null;
            })

            // Favorite vegetables
            .addCase(fetchFavoriteVegetables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoriteVegetables.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(fetchFavoriteVegetables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string | null;
            });
    },
});

export default vegetableSlice.reducer;