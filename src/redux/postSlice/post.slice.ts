import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {
    createPost,
    getPostById,
    updatePost,
    replyPost,
    transferPostStatus,
    toggleReplyActive, getQueriedPosts,
} from './post.thunks.ts';
import type { Page } from '../../shared/models/Pages.ts';
import type {IPost} from '../../shared/models/IPost.ts';
import type IErrorResponse from "../../shared/models/IErrorResponse.ts";

interface IPostsState {
    postPage: Page<IPost> | null;
    currentPost: IPost | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IPostsState = {
    postPage: null,
    currentPost: null,
    status: 'idle',
    error: null,
};

const postSlice = createSlice({
    name: 'posts', // The name of the slice
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- getQueriedPosts ---
            .addCase(getQueriedPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getQueriedPosts.fulfilled, (state, action: PayloadAction<Page<IPost>>) => {
                state.status = 'succeeded';
                state.error = null;
                state.postPage = action.payload;
            })
            .addCase(getQueriedPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to retrieve posts';
            })

            // --- createPost ---
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.status = 'succeeded';
                state.error = null;
                state.currentPost = action.payload;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to create post';
            })

            // --- getPostById ---
            .addCase(getPostById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPostById.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.status = 'succeeded';
                state.error = null;
                state.currentPost = action.payload;
            })
            .addCase(getPostById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to retrieve post';
            })

            // --- updatePost ---
            .addCase(updatePost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.status = 'succeeded';
                state.error = null;
                state.currentPost = action.payload;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to update post';
            })

            // --- replyPost ---
            .addCase(replyPost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(replyPost.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.status = 'succeeded';
                state.error = null;
                state.currentPost = action.payload;
            })
            .addCase(replyPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to reply to post';
            })

            // --- transferPostStatus ---
            .addCase(transferPostStatus.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(transferPostStatus.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.status = 'succeeded';
                state.error = null;
                state.currentPost = action.payload;
            })
            .addCase(transferPostStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to change post status';
            })

            // --- toggleReplyActive ---
            .addCase(toggleReplyActive.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(toggleReplyActive.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.status = 'succeeded';
                state.error = null;
                state.currentPost = action.payload;
            })
            .addCase(toggleReplyActive.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as IErrorResponse)?.error || action.payload as string || 'Failed to toggle reply visibility';
            });
    },
});

export default postSlice.reducer;