import {configureStore} from "@reduxjs/toolkit";
import postReducer from './postSlice/post.slice.ts';
import userReducer from './userSlice/user.slice.ts';
import authReducer from './authSlice/auth.slice.ts';


const store = configureStore({
    reducer:{
        auth: authReducer,
        user: userReducer,
        post: postReducer,
    },

    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch