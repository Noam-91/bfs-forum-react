import {configureStore} from "@reduxjs/toolkit";
import userReducer from './userSlice/user.slice';
import postsReducer from "./postsSlice/posts.slice";

const store = configureStore({
    reducer:{
        user: userReducer,
        posts: postsReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
