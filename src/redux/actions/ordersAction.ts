import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetOrder } from "../../services/orderAPI";

interface IDate {
    date?: string;
    fromDate: string;
    toDate: string;
    db_name?: string;
}


export const fetchOrders = createAsyncThunk("fetchOrders",
    async (payload: IDate) => {
        console.log("payload fetch", payload);
        const res = await GetOrder(payload);
        console.log("orders", res);
        return res.data;
    }
);