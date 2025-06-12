export interface IMessage {
    id: string;
    email: string;
    subject: string;
    content: string;
    status: MessageStatus;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
}
type MessageStatus = 'SOLVED' | 'UNSOLVED';

export interface ContactFormData {
    email: string;
    subject: string;
    content: string;
}
export interface PaginatedMessageResponse {
    content: IMessage[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}