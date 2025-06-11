import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type IUser from "../../shared/models/IUser.ts";
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";

export const login = createAsyncThunk(
    'auth/login',
    async (loginForm: { username: string; password: string }, thunkAPI) => {
        try {
            const response = await axios.post(`http://localhost:8080/auth/login`, loginForm);
            const user: IUser = response.data.user;
            sessionStorage.setItem('role', user.role);
            return { user };
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_,thunkAPI) => {
        try{
            await axios.post(`http://localhost:8080/auth/logout`,null,{withCredentials:true});
        } catch (error: unknown) { // Good: using unknown
            return handleThunkAxiosError(error, thunkAPI);
        }
        sessionStorage.removeItem('role');
    }
);

export const checkAuth = createAsyncThunk< {user:IUser}, void, {rejectValue: unknown}>(
    'auth/checkAuth',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`http://localhost:8080/auth/checkAuth`, {withCredentials:true});
            const user: IUser = response.data.user;
            sessionStorage.setItem('role', user.role);
            return { user };
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);