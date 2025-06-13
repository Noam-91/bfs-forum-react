 import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {handleThunkAxiosError} from "../../shared/utils/thunkErrorHandlers.ts";
import type IErrorResponse from "../../shared/models/IErrorResponse.ts";
import type {IPost, IPostQueryParameters, PostOperation} from "../../shared/models/IPost.ts";
import type {Page} from "../../shared/models/Page.ts";

// post.thunks.ts

export const getAllPosts = createAsyncThunk<IPost[]>(
  'posts/getAllPosts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<IPost[]>('/api/admin/posts/all'); // Adjust your backend route
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch all posts');
    }
  }
);

export const getQueriedPosts = createAsyncThunk<
    Page<IPost>,
    IPostQueryParameters,
    { rejectValue: IErrorResponse | string }
>(
    'posts/getPostPage',
    async (params: IPostQueryParameters, thunkAPI) => {
        try {
            const queryString = buildQueryParams(params);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/posts${queryString}`, {withCredentials:true});
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const createPost = createAsyncThunk<
    IPost,
    IPost,
    { rejectValue: IErrorResponse | string }
>(
    'posts/createPost',
    async (postData: IPost, thunkAPI) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/posts`, postData, {
                withCredentials: true,
            });
            console.log('Action: createPost response data', response.data);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const getPostById = createAsyncThunk<
    IPost,
    string,
    { rejectValue: IErrorResponse | string }
>(
    'posts/getPostById',
    async (postId: string, thunkAPI) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/posts/${postId}`, {
                withCredentials: true,
            });
            console.log('Action: getPostById response data', response.data);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const updatePost = createAsyncThunk<
    IPost,
    { postId: string; postData: IPost },
    { rejectValue: IErrorResponse | string }
>(
    'posts/updatePost',
    async ({ postId, postData }, thunkAPI) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/posts/${postId}`, postData, {
                withCredentials: true,
            });
            console.log('Action: updatePost response data', response.data);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const replyPost = createAsyncThunk<
    IPost,
    { postId: string; comment: string; replyId?: string },
    { rejectValue: IErrorResponse | string }
>(
    'posts/replyPost',
    async ({ postId, comment, replyId }, thunkAPI) => {
        try {
            const queryString = replyId ? `?replyId=${encodeURIComponent(replyId)}` : '';
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/posts/${postId}${queryString}`, comment, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'text/plain' // Spring expects text/plain for @RequestBody String
                }
            });
            console.log('Action: replyPost response data', response.data);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const transferPostStatus = createAsyncThunk<
    IPost,
    { postId: string; operation: PostOperation },
    { rejectValue: IErrorResponse | string }
>(
    'posts/transferPostStatus',
    async ({ postId, operation }, thunkAPI) => {
        try {
            const queryString = `?operation=${encodeURIComponent(operation)}`;
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}/posts/${postId}${queryString}`, null, { // PATCH with null body
                withCredentials: true,
            });
            console.log('Action: transferPostStatus response data', response.data);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const toggleReplyActive = createAsyncThunk<
    IPost,
    { postId: string; replyId: string; subReplyId?: string },
    { rejectValue: IErrorResponse | string }
>(
    'posts/toggleReplyActive',
    async ({ postId, replyId, subReplyId }, thunkAPI) => {
        try {
            const queryString = subReplyId ? `?subReplyId=${encodeURIComponent(subReplyId)}` : '';
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}/posts/${postId}/reply/${replyId}${queryString}`, null, { // PATCH with null body
                withCredentials: true,
            });
            console.log('Action: toggleReplyActive response data', response.data);
            return response.data;
        } catch (error) {
            return handleThunkAxiosError(error, thunkAPI);
        }
    }
);

export const getTop3UserPosts = createAsyncThunk<IPost[], string>(
  'posts/getTop3UserPosts',
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`/posts`, {
        params: {
          userId,
          status: 'PUBLISHED',
          sortBy: 'replyCount',
          sortDir: 'desc',
          size: 3
        },
        withCredentials: true,
      });
      return res.data.content; // assuming Page<IPost>
    } catch (err) {
      return handleThunkAxiosError(err, thunkAPI);
    }
  }
);

export const getUserDrafts = createAsyncThunk<IPost[], string>(
  'posts/getUserDrafts',
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`/posts`, {
        params: {
          userId,
          status: 'UNPUBLISHED',
        },
        withCredentials: true,
      });
      return res.data.content;
    } catch (err) {
      return handleThunkAxiosError(err, thunkAPI);
    }
  }
);


/** Build query params from object. */
const buildQueryParams = (params: IPostQueryParameters): string => {
    const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    return query ? `?${query}` : '';
};

