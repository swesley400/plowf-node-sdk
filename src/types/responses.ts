import { PaginationMeta } from './common';

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
