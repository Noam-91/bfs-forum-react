// src/shared/models/post.model.ts
export enum PostStatus {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  BANNED = 'BANNED',
  DELETED = 'DELETED'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: number;
  userName: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  replyCount: number;
  isArchived: boolean;
}