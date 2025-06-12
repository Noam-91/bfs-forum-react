import type IUser from '../../../shared/models/IUser.ts';

export interface PaginatedUserResponse {
    content: IUser[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // 当前页索引
}