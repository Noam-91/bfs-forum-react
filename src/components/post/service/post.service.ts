// src/services/post.service.ts
import API from './api.service';
import { Post } from '../../../shared/models/post.model';

export const postService = {
  // Get all published posts
  getPublishedPosts: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await API.get('/posts', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (id: string) => {
    const response = await API.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData: Partial<Post>) => {
    const response = await API.post('/posts', postData);
    return response.data;
  },

  // Update post
  updatePost: async (id: string, postData: Partial<Post>) => {
    const response = await API.put(`/posts/${id}`, postData);
    return response.data;
  }
};