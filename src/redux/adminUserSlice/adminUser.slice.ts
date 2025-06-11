import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../redux/store';
import type IUser from '../../shared/models/IUser';
import { fetchAllUsers, banUser, activateUser } from './adminUser.thunks';
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
            // 获取所有用户
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

            // 封禁用户
            .addCase(banUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })

            // 启用用户
            .addCase(activateUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            });
    },
});

export default adminUserSlice.reducer;

// ✅ Selectors
export const selectUsers = (state: RootState) => state.adminUser.users;
export const selectUserStatus = (state: RootState) => state.adminUser.fetchStatus;
export const selectPaginationInfo = createSelector(
    [(state: RootState) => state.adminUser],
    (adminUser) => ({
        page: adminUser.page,
        size: adminUser.size,
        totalPages: adminUser.totalPages,
        totalElements: adminUser.totalElements,
    })
);