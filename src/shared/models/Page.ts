export interface Page<T> {
    content: T[];
    pageable: IPageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    empty: boolean;
    sort: ISort;
}

interface ISort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface PaginatedMessageResponse {
    content: IMessage[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}