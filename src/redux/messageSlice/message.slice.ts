import {createSlice} from "@reduxjs/toolkit";
import {getAllMessages, getMessage, sendMessage, solvedMessage} from "./message.thunks.ts";

interface IMessageState{
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const initialState: IMessageState = {
    status: 'idle',
    error: null,
};
const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            // send message
            .addCase(sendMessage.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state)=>{
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(sendMessage.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // get all messages
            .addCase(getAllMessages.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllMessages.fulfilled, (state)=>{
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(getAllMessages.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // get one message
            .addCase(getMessage.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getMessage.fulfilled, (state)=>{
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(getMessage.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // solve message
            .addCase(solvedMessage.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(solvedMessage.fulfilled, (state)=>{
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(solvedMessage.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export default messageSlice.reducer;