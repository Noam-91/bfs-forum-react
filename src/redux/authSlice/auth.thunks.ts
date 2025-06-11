import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type IUser from "../../shared/models/IUser.ts";
import type { ILoginFormData } from "../../shared/models/IUser.ts";
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";

export const login = createAsyncThunk(
    'auth/login',
    async (loginForm: ILoginFormData, thunkAPI) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API}/auth/login`, loginForm,{withCredentials:true});
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_,thunkAPI) => {
        try{
            await axios.post(`${import.meta.env.VITE_BACKEND_API}/auth/logout`,null,{withCredentials:true});
        } catch (error: unknown) { // Good: using unknown
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const checkAuth = createAsyncThunk< {user:IUser}, void, {rejectValue: unknown}>(
    'auth/checkAuth',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/auth`, {withCredentials:true});
            const user: IUser = response.data;
            return { user };
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

