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

interface IPageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: ISort;
}