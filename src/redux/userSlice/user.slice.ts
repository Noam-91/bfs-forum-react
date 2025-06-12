import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { register, verifyEmail } from './user.thunks';

interface RegisterState {
    registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    registerError: string | null;

    verifyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    verifyError: string | null;
    verifiedFirstName: string | null;
}

const initialState: RegisterState = {
    registerStatus: 'idle',
    registerError: null,

    verifyStatus: 'idle',
    verifyError: null,
    verifiedFirstName: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetRegisterState(state) {
            state.registerStatus = 'idle';
            state.registerError = null;
        },
        resetVerifyState(state) {
            state.verifyStatus = 'idle';
            state.verifyError = null;
            state.verifiedFirstName = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 注册
            .addCase(register.pending, (state) => {
                state.registerStatus = 'loading';
                state.registerError = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.registerStatus = 'succeeded';
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.registerStatus = 'failed';
                state.registerError = action.payload || 'Registration failed.';
            })

            // 邮箱验证
            .addCase(verifyEmail.pending, (state) => {
                state.verifyStatus = 'loading';
                state.verifyError = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.verifyStatus = 'succeeded';
                state.verifiedFirstName = action.payload.user.firstName;
            })
            .addCase(verifyEmail.rejected, (state, action: PayloadAction<any>) => {
                state.verifyStatus = 'failed';
                state.verifyError = action.payload || 'Verification failed.';
            });
    },
});

export const { resetRegisterState, resetVerifyState } = userSlice.actions;

export default userSlice.reducer;

import type { RootState } from '../../redux/store';

export const selectRegisterStatus = (state: RootState) => state.user.registerStatus;
export const selectRegisterError = (state: RootState) => state.user.registerError;

export const selectVerifyStatus = (state: RootState) => state.user.verifyStatus;
export const selectVerifyError = (state: RootState) => state.user.verifyError;
export const selectVerifiedFirstName = (state: RootState) => state.user.verifiedFirstName;