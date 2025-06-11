export default interface IPost {
    id?: string,
    title: string,
    content: string,
    userId: number,
    userName: string,
    status: PostStatus,
    createdAt: string,
    updatedAt: string,
    viewCount: number,
    replyCount: number,
    isArchived: boolean
}

type PostStatus = "UNPUBLISHED" | "PUBLISHED" | "HIDDEN" | "BANNED" | "DELETED";