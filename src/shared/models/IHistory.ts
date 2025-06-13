export interface IHistory {
  postId: string;
  viewedAt: string;
  post: IPost[];
}
export interface IPost {
    title: string;
    firstName: string;
    lastName: string;
    replyCount: number;
    viewCount: number;

}
export interface IHistoryQueryParameters {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    keyword?: string;
    startDate?: string;
    endDate?: string;
}

