import {configureStore} from "@reduxjs/toolkit";
import authReducer from './authSlice/auth.slice.ts';

const store = configureStore({
    reducer:{
        auth: authReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
