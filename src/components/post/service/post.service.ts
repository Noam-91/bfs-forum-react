// src/services/post.service.ts
import API from './api.service';
import { Post, PostStatus } from '../../../shared/models/post.model';
import { mockUserPosts } from "../../../mock/posts.mock";

const API_URL = 'http://localhost:8080';

export interface CreatePostRequest {
    title: string;
    content: string;
    attachmentUrls?: string[];
}

export interface CreatePostResponse {
    success: boolean;
    data?:{
        id: string;
        title: string;
        content: string;
        createdAt: string;
        status: string;
    };
    error?: string;
}

interface PostResponse {
  content: Post[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


export const postService = {
  // create posts
  createPost: async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
    try {
      const response = await API.post('/posts/new', postData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Create post error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create.'
      };
    }
  },

  createReply: async (postId: string, reply: {content: string}) => {
    console.log(`[Mock] Creating reply for post${postId}:`, reply.content);
    return{
      success: true,
      data: {
        id: Math.random().toString(36).substring(2, 9),
        content: reply.content,
        author: 'MockUser',
        createdAt: new Date().toISOString(),
        userId: localStorage.getItem('userId') || 'mock-user',
      }
    }
  },

  // Get all published posts
  getPublishedPosts: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await API.get('/posts', {
      params: { 
        page, 
        size, 
        sortBy, 
        sortDir,
        status: PostStatus.PUBLISHED,
        includeUserInfo: false }
    });
    return response.data;
  },

  // // Get post by ID
  // getPostById: async (id: string) => {
  //   const response = await API.get(`/posts/${id}`);
  //   return response.data;
  // },

  // Update post
  updatePost: async (id: string, postData: Partial<Post>) => {
    const response = await API.put(`/posts/${id}`, postData);
    return response.data;
  },

  // mock
  getPostById: async (id: string) => {
    const post = mockUserPosts.find(post => post.id === id);
    if (post) {
      return post;
    }
    throw new Error('Post not found');
  }
};