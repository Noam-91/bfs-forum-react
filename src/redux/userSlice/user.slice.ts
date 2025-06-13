import {createSlice} from '@reduxjs/toolkit';
import type IUser from "../../shared/models/IUser.ts";
import type {Page} from "../../shared/models/Page.ts";
import {
    register,
    verifyEmail,
    updateProfile,
    getUserProfile,
    banUser,
    activateUser,
    updateUserRole, getAllUsers
} from "./user.thunks.ts";

interface IUserState{
    userPage: Page<IUser> | null;
    currentUser: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
type ErrorResponse = {
    message: string;
};

const initialState: IUserState = {
    userPage: null,
    currentUser: null,
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUserState: (state) => {
            state.userPage = null;
            state.currentUser = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Registration failed.';
            })

            // Email Verification
            .addCase(verifyEmail.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Verification failed.';
            })

            // Get User Profile
            .addCase(getUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Get user profile failed.';
            })

            // Update User Profile
            .addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Update failed.';
            })

            // Ban User
            .addCase(banUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(banUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(banUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Ban user failed.';
            })

            // Activate User
            .addCase(activateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(activateUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(activateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Activate user failed.';
            })

            // updateUserRole
            .addCase(updateUserRole.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Update user role failed.';
            })

            // getAllUsers
            .addCase(getAllUsers.pending,(state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state,action) => {
                state.status = 'succeeded';
                state.error = null;
                state.userPage = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as ErrorResponse).message || 'Update user role failed.';
            })
    }
});

<<<<<<< HEAD
export default userSlice.reducer;
=======
export const { resetRegisterState, resetVerifyState } = userSlice.actions;

export default userSlice.reducer;

import type { RootState } from '../../redux/store';

export const selectRegisterStatus = (state: RootState) => state.user.registerStatus;
export const selectRegisterError = (state: RootState) => state.user.registerError;

export const selectVerifyStatus = (state: RootState) => state.user.verifyStatus;
export const selectVerifyError = (state: RootState) => state.user.verifyError;
export const selectVerifiedFirstName = (state: RootState) => state.user.verifiedFirstName;
>>>>>>> 20172410e72a88cf47c0ba674c02aeda497df803
