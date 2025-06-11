import {configureStore} from "@reduxjs/toolkit";
import authReducer from './authSlice/auth.slice.ts';
import messageReducer from './messageSlice/message.slice.ts';
import postReducer from './postSlice/post.slice.ts';

const store = configureStore({
    reducer:{
        auth: authReducer,
        message: messageReducer,
        post: postReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
