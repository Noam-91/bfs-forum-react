import {configureStore} from "@reduxjs/toolkit";
import userReducer from './userSlice/user.slice';
import historyReducer from './historySlice/history.slice';

const store = configureStore({
    reducer:{
        user: userReducer,
        history: historyReducer
    },
    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
