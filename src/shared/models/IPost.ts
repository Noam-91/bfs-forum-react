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
    searchIn?: 'title' | 'content';
    userId?: string;
}


export type PostOperation = 'BAN'|'UNBAN'|'HIDE'|'SHOW'|'DELETE'|'RECOVER'|'ARCHIVE'|'UNARCHIVE';