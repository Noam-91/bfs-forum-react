import {createSlice} from "@reduxjs/toolkit";
import type IUser from "../../shared/models/IUser.ts";
import {checkAuth, login, logout} from "./auth.thunks.ts";

interface IUserState {
    user: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        status: 'idle',
        error: null
    } as IUserState,
    reducers: { },
    extraReducers:(builder)=>{
        builder
            // login
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action)=>{
                state.user = action.payload.user;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(login.rejected, (state, action)=>{
                state.user = null;
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // logout
            .addCase(logout.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logout.fulfilled, (state)=>{
                state.user = null;
                state.status = 'idle';
                state.error = null;
            })
            .addCase(logout.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.payload as string;
            })

            //checkAuth
            .addCase(checkAuth.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action)=>{
                state.user = action.payload.user;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action)=>{
                state.user = null;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    },
    selectors:{
        selectIsLoggedIn: (state) => !!state.user,
        selectUserRole: (state) => state.user?.role,
    }
});

export default authSlice.reducer;
export const {selectIsLoggedIn, selectUserRole} = authSlice.selectors;

