import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {Page} from '../../shared/models/Page.ts'
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";
import type IErrorResponse from "../../shared/models/IErrorResponse.ts";
import type { IHistory, IHistoryQueryParameters } from '../../shared/models/IHistory.ts';
import type { RootState } from '../store' ;

export const getQueriedHistory = createAsyncThunk<
    Page<IHistory>,
    IHistoryQueryParameters,
    { rejectValue: IErrorResponse | string }
>(
    'history/getHistoryPage',
    async (params: IHistoryQueryParameters, thunkAPI) => {
        try {
            //1) params for search fileds existence
            const {keyword, startDate, endDate} = params;
            const hasFilters = !!(keyword || startDate || endDate);
            //2) build full query 
            const queryString = buildQueryParams(params);
            //3) choose endpoint
            console.log("queryString: " + queryString)
            const url = hasFilters? `${import.meta.env.VITE_BACKEND_API}/history/search${queryString}`:
             `${import.meta.env.VITE_BACKEND_API}/history${queryString}` 
            // 4) fetch data
            const response = await axios.get(url, {withCredentials:true});
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);
export const recordHistoryView = createAsyncThunk<string, { postId: string; userId: string }, {state: RootState; rejectValue: IErrorResponse |string}>(
    './history/recordView',
    async ({postId }, thunkAPI) => {
        try{
            const url = `${import.meta.env.VITE_BACKEND_API}/history/map/${postId}`;
            const response = await axios.post(
                url,
                null,
                {withCredentials: true}
            )
            return response.data;
        }catch(error){
           return handleThunkAxiosError(error, thunkAPI);
        }
    }
)


/** Build query params from object. */
const buildQueryParams = (params: IHistoryQueryParameters): string => {
    const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    return query ? `?${query}` : '';
};