import axios from 'axios';
export interface IPost {
    id?: string;
    userInfo: IUserInfo;
    title: string;
    content: string;
    status: 'UNPUBLISHED'|"PUBLISHED"|"HIDDEN"|"BANNED"|"ARCHIVED"|"DELETED";
    createdAt?: Date;
    updatedAt?: Date;
    images: string[];
    attachments: string[];
    replies: IReply[];
    viewCount: number;
    replyCount: number;
}

export interface IReply {
    id?: string;
    userInfo: IUserInfo;
    comment: string;
    isActive: boolean;
    createdAt?: Date;
    subReplies: ISubReply[];
}

export interface ISubReply {
    id?: string;
    userInfo: IUserInfo;
    comment: string;
    isActive: boolean;
    createdAt?: Date;
}

interface IUserInfo {
    id: string;
    firstName?: string;
    lastName?: string;
    imgUrl?: string;
}

export interface IPostQueryParameters {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    status?: string;
    keyword?: string;
    searchIn?: 'title' | 'content' | 'author';
    userId?: string;
}


export type PostOperation = 'BAN'|'UNBAN'|'HIDE'|'SHOW'|'DELETE'|'RECOVER'|'ARCHIVE'|'UNARCHIVE';
async function fetchUserPosts() {
  try {
    // If you have a baseURL configured in axios, you can omit it here
    const response = await axios.get<IPost[]>(`/63328/posts`, {
    });
    return response.data;      // this will be your array of Post
  } catch (err) {
    console.error('Error fetching posts', err);
    throw err;
  }
}

// Usage
fetchUserPosts().then(posts => {
  console.log(posts);
});