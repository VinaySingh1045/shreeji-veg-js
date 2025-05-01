import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders } from "../actions/ordersAction";

const ordersSlice = createSlice({
    name: "order",
    initialState: {
        loading: false,
        orders: null,
        isError: false,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        builder.addCase(fetchOrders.rejected, (state) => {
            state.isError = true;
        })
    }

})

export default ordersSlice.reducer;
