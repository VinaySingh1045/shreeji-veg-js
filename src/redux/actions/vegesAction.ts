import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetAllItems, GetFavorites } from '../../services/vegesAPI';

// Async thunk for fetching all vegetables
export const fetchAllVegetables = createAsyncThunk(
    'vegetables/fetchAll',
    async () => {
        const response = await GetAllItems();
        return response;
    }
);

// Async thunk for fetching favorite vegetables
export const fetchFavoriteVegetables = createAsyncThunk(
    'vegetables/fetchFavorites',
    async () => {
        const response = await GetFavorites();
        return response;
    }
);
