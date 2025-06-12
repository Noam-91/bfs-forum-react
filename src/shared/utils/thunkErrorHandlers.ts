import axios, { AxiosError } from 'axios';
import type {AsyncThunkPayloadCreator, ThunkDispatch} from '@reduxjs/toolkit';
import type IErrorResponse from "../../shared/models/IErrorResponse.ts";
import type {UnknownAction} from "redux";

/**
 * A helper function to handle common Axios errors in createAsyncThunk.
 * It extracts a user-friendly message from the error and uses thunkAPI.rejectWithValue.
 *
 * @param error The caught error object.
 * @param thunkAPI The thunkAPI object provided by createAsyncThunk.
 * @param defaultMessage A default message to use if a more specific error message cannot be extracted.
 * @returns The result of thunkAPI.rejectWithValue, which will set the rejected action's payload.
 */
export const handleThunkAxiosError = (
    error: unknown,
    thunkAPI: Parameters<AsyncThunkPayloadCreator<unknown, unknown, AsyncThunkConfig>>[1],
    defaultMessage: string = 'An unknown error occurred.'
): ReturnType<typeof thunkAPI.rejectWithValue> => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<IErrorResponse>;

        if (axiosError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (axiosError.response.data && axiosError.response.data.error) {
                // Prioritize backend-provided error message
                return thunkAPI.rejectWithValue(axiosError.response.data.error);
            } else {
                // Fallback to Axios status/statusText if no specific message from backend
                return thunkAPI.rejectWithValue(
                    `Error: ${axiosError.response.status} ${axiosError.response.statusText}`
                );
            }
        } else if (axiosError.request) {
            // The request was made but no response was received
            return thunkAPI.rejectWithValue('No response received from server. Please check your network connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            return thunkAPI.rejectWithValue(`Request setup error: ${axiosError.message}`);
        }
    } else if (error instanceof Error) {
        // A generic JavaScript Error object
        return thunkAPI.rejectWithValue(error.message);
    } else {
        // Any other unknown type of error
        return thunkAPI.rejectWithValue(defaultMessage);
    }
};

type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
};