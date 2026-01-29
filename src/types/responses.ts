import { PaginationMeta } from './common';

export interface ApiResponse<T> {
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
