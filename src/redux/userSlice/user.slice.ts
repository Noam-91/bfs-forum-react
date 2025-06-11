import {register,verifyEmail} from "./user.thunks.ts";
import {createSlice} from "@reduxjs/toolkit";
import type IUser from "../../shared/models/IUser.ts";


interface IUserState {
    user: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

    verifyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    verifyMessage: string | null;
    verifiedFirstName: string | null;
}
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        status: 'idle',
        error: null,
        verifyStatus: 'idle',
        verifyMessage: null,
        verifiedFirstName: null
    } as IUserState,

    reducers: { },
    extraReducers:(builder)=>{
        builder
            //register
            .addCase(register.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(register.fulfilled, (state)=>{
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(register.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.payload as string;
            })

            //checkAuth
            .addCase(verifyEmail.pending, (state) => {
                state.verifyStatus = 'loading';
                state.verifyMessage = null;
                state.verifiedFirstName = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.verifyStatus = 'succeeded';
                state.verifyMessage = action.payload.message;
                state.verifiedFirstName = action.payload.user.firstName;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.verifyStatus = 'failed';
                state.verifyMessage = action.payload ?? 'Email verification failed';
            })
    },
});


import type { RootState } from '../store.ts';

export const selectRegisterStatus = (state: RootState) => state.user.status;
export const selectRegisterError = (state: RootState) => state.user.error;

export const selectVerifyStatus = (state: RootState) => state.user.verifyStatus;
export const selectVerifyMessage = (state: RootState) => state.user.verifyMessage;
export const selectVerifiedFirstName = (state: RootState) => state.user.verifiedFirstName;

export default userSlice.reducer;