export default interface IErrorResponse{
    error: string;
    status?: number;
    timestamp?: Date;
    path?: string;
    requestId?: string;
}
