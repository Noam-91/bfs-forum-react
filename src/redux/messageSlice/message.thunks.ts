import {createAsyncThunk} from "@reduxjs/toolkit";
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";
import axios from "axios";
import type {ContactFormData} from "../../shared/models/IMessage.ts";

export const sendMessage = createAsyncThunk(
    'messages/send',
    async (contactForm: ContactFormData, thunkAPI) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API}/messages`, contactForm);

        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
)

export const getAllMessages = createAsyncThunk(
    'messages/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/messages`, {withCredentials:true});
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
)

export const getMessage = createAsyncThunk(
    'messages/getOne',
    async (id: number, thunkAPI) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/messages/${id}`, {withCredentials:true});
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
)

export const solvedMessage = createAsyncThunk(
    'messages/solve',
    async (id: string, thunkAPI) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_API}/messages/${id}`, null, {withCredentials:true});
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
)