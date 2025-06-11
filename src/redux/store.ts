import {configureStore} from "@reduxjs/toolkit";
import userReducer from './userSlice/user.slice';
import authReducer from './authSlice/auth.slice';
import adminUserReducer from './adminUserSlice/adminUser.slice';

const store = configureStore({
    reducer:{
        user: userReducer,
        auth: authReducer,
        adminUser: adminUserReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
