import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";

type RegisterResponse = {
    message: string;
    userId?: string;
};

export const register = createAsyncThunk<
    RegisterResponse,
    {
        username: string;
        firstName: string;
        lastName: string;
        password: string;
        imgUrl: string;
    },
    { rejectValue: string }
>('users/register', async (userData, thunkAPI) => {
    try {
        const res = await axios.post(`http://localhost:8080/users/register`, userData);
        return res.data as RegisterResponse;
    } catch (error) {
        return handleThunkAxiosError(error, thunkAPI) as ReturnType<typeof thunkAPI.rejectWithValue>;
    }
});

type VerifyResponse = {
    message: string;
    user: {
        firstName: string;
    };
};
export const verifyEmail = createAsyncThunk<
    VerifyResponse,
    string,
    { rejectValue: string }
>(
    'users/verifyEmail',
    async (token, thunkAPI) => {
        try {
            const res = await axios.get(`http://localhost:8080/users/verify?token=${token}`);
            return res.data as VerifyResponse; // "Email verification successful, welcome! + user.profile.firstName"
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI) as ReturnType<typeof thunkAPI.rejectWithValue>;
        }
    }
);

