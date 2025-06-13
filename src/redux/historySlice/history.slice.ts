import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import { getQueriedHistory } from './hisotry.thunks.ts';
import type {Page} from "../../shared/models/Page.ts";
import type { IHistory } from '../../shared/models/IHistory.ts';
import type IErrorResponse from '../../shared/models/IErrorResponse.ts';

interface IHistoryState {
    historyPage: Page<IHistory> | null;
    currentHistory: IHistory | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IHistoryState = {
    historyPage: null,
    currentHistory: null,
    status: 'idle',
    error: null,
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.
         // --- getQueriedPosts ---
        addCase(getQueriedHistory.pending, (state)=>{
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getQueriedHistory.fulfilled, (state, action: PayloadAction<Page<IHistory>>)=>{
            state.status = 'succeeded';
            state.error = null;
            state.historyPage = action.payload;
        })
        .addCase(getQueriedHistory.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to retrieve history';
        })
    }

})

export default historySlice.reducer
