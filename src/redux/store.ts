import {configureStore} from "@reduxjs/toolkit";
import userReducer from './userSlice/user.slice';

const store = configureStore({
    reducer:{
        user: userReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
