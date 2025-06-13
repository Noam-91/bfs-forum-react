import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";
import type IUser from "../../shared/models/IUser.ts";

export const register = createAsyncThunk('users/register', async (userData:IUser, thunkAPI) => {
    try {
        await axios.post(`http://localhost:8080/users/register`, userData);
    } catch (error) {
        return handleThunkAxiosError(error, thunkAPI);
    }
});


export const verifyEmail = createAsyncThunk(
    'users/verifyEmail',
    async (token, thunkAPI) => {
        try {
            await axios.get(`http://localhost:8080/users/verify?token=${token}`);
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);


export const getUserProfile = createAsyncThunk<
    IUser,
    string,
    { rejectValue: { message: string } | string }>(
    'users/getUserProfile',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${userId}/profile`, {withCredentials:true});
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);


export const updateProfile = createAsyncThunk(
    'users/updateProfile',
    async (user:IUser, thunkAPI) => {
        try {
            await axios.put(`http://localhost:8080/users/${user.id}/profile`, {withCredentials:true});
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const banUser = createAsyncThunk(
    'users/banUser',
    async (userId: string, thunkAPI) => {
        try {
            await axios.put(`http://localhost:8080/users/${userId}/activation`, {
                isActive: false,
            },{withCredentials:true});
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const activateUser = createAsyncThunk(
    'users/activateUser',
    async (userId: string, thunkAPI) => {
        try {
            await axios.put(`http://localhost:8080/users/${userId}/activation`, {
                isActive: true,
            },{withCredentials:true});
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'users/updateUserRole',
    async ({userId, role}:{userId:string,role:string}, thunkAPI) => {
        try {
            await axios.put(`http://localhost:8080/users/${userId}/role?role=${role}`,null , {withCredentials:true});
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

type GetAllUsersParams = {
    page: number,
    size: number,
    username?: string,
    role?: string
}

export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async (params:GetAllUsersParams, thunkAPI) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/page?${buildParams(params)}`, {withCredentials:true});
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

/** Build query params from object. */
const buildParams = (params: GetAllUsersParams): string => {
    const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    return query ? `?${query}` : '';
};