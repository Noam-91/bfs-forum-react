// src/shared/models/post.model.ts
export enum PostStatus {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  BANNED = 'BANNED',
  DELETED = 'DELETED'
}

export interface UserInfo {
  userId: string;
  firstName?: string;
  lastName?: string;
  imgUrl?: string;
}

export interface SubReply{
  id: string;
  content: string;
  userInfo: UserInfo;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Reply {
  id: string;
  content: string;
  userInfo: UserInfo;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  subReplies?: SubReply[]; // Nested replies
}


export interface Post {
  id: string;
  title: string;
  content: string;
  userInfo: UserInfo;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  replyCount: number;
  isArchived: boolean;

  images?: string[];
  attachments?: string[];
  replies?: Reply[];
}