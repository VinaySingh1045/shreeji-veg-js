import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slice/authSlice";
import vegetableReducer from "./slice/vegesSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vegetables: vegetableReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;