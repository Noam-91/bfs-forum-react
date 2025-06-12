import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store.ts';
import type IUser from '../../../shared/models/IUser.ts';
import { fetchAllUsers, banUser, activateUser } from './adminUser.thunks.ts';
import { createSelector } from '@reduxjs/toolkit';

interface AdminUserState {
    users: IUser[];
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
}

const initialState: AdminUserState = {
    users: [],
    fetchStatus: 'idle',
    error: null,
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
};

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.fetchStatus = 'loading';
            })

            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                state.users = action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })

            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.error = action.error.message ?? 'Failed to fetch users';
            })

            .addCase(banUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.users = state.users.map(user =>
                    user.id === action.payload.id ? action.payload : user
                );
            })

            .addCase(activateUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.users = state.users.map(user =>
                    user.id === action.payload.id ? action.payload : user
                );
            });
    },
});

export default adminUserSlice.reducer;

export const selectUsers = (state: RootState) =>
    state.adminUser?.users ?? []; // fallback to [] even if undefined
export const selectUserStatus = (state: RootState) => state.adminUser.fetchStatus;
export const selectPaginationInfo = createSelector(
    [(state: RootState) => state.adminUser],
    (adminUser) => ({
        page: adminUser.page ?? 0,
        size: adminUser.size ?? 10,
        totalPages: adminUser.totalPages ?? 1,
        totalElements: adminUser.totalElements ?? 0,
    })
);