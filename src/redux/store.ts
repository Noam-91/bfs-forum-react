import {configureStore} from "@reduxjs/toolkit";
import postReducer from './postSlice/post.slice.ts';
import userReducer from './userSlice/user.slice.ts';

const store = configureStore({
    reducer:{
        user: userReducer,
        post: postReducer,
    },

    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch