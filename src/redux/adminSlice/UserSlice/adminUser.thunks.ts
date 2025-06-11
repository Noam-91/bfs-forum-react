import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type IUser from '../../../shared/models/IUser.ts';
import type { PaginatedUserResponse } from './adminUser.types.ts';
import { handleThunkAxiosError } from '../../../shared/utils/thunkErrorHandlers.ts';


export const fetchAllUsers = createAsyncThunk<
    PaginatedUserResponse,
    { page: number; size: number; username?: string; role?: string }
>(
    'adminUser/fetchAll',
    async ({ page, size, username, role }, thunkAPI) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());

            if (username?.trim()) {
                params.append('username', username.trim());
            }

            if (role && role !== 'ALL') {
                params.append('role', role);
            }

            const response = await axios.get(`http://localhost:8080/users/page?${params.toString()}`);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const banUser = createAsyncThunk<IUser, string>(
    'adminUser/ban',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.put(`http://localhost:8080/users/${userId}/activation`, {
                isActive: false,
            });
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const activateUser = createAsyncThunk<IUser, string>(
    'adminUser/activate',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.put(`http://localhost:8080/users/${userId}/activation`, {
                isActive: true,
            });
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);