import { PaginationParams } from '../../types/common';
import { ApiResponse } from '../../types/responses';

export type PixKeyType = 'DOCUMENT' | 'EMAIL' | 'PHONE' | 'RANDOM';

export interface PixKey {
    key: string;
    type: PixKeyType;
    is_active: boolean;
    created_at: string;
}

export interface RequestPixKeyAuthCodeData {
    key: string;
}

export interface PixKeyAuthCode {
    auth_code_id: string;
}

export interface CreatePixKeyData {
    type: PixKeyType;
    auth_code_id?: string;
    auth_code?: string;
}

export interface ListPixKeysParams extends PaginationParams {
    type?: PixKeyType;
    is_active?: boolean;
}

export interface MessageResponse {
    message: string;
}

export interface MessageApiResponse<T> extends ApiResponse<T> {
    message?: string;
}
