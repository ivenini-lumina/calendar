import { configureStore } from '@reduxjs/toolkit';
import { uiSlice } from './ui/uiSlice';
import { authSlice } from './auth/authSlice';

export const store = configureStore({
    reducer: {
        auth:   authSlice.reducer,
        ui:     uiSlice.reducer
    }
});