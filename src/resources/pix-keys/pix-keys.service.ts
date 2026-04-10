import { HttpClient } from '../../http/http-client';
import { PaginatedResponse } from '../../types/responses';
import { toQueryString } from '../../utils/serializer';
import {
    CreatePixKeyData,
    ListPixKeysParams,
    MessageApiResponse,
    MessageResponse,
    PixKey,
    PixKeyAuthCode,
    RequestPixKeyAuthCodeData,
} from './pix-keys.types';

export class PixKeysService {
    private readonly http: HttpClient;
    private readonly basePath = '/pix-keys';

    constructor(http: HttpClient) {
        this.http = http;
    }

    async list(params?: ListPixKeysParams): Promise<PaginatedResponse<PixKey>> {
        const query = params ? toQueryString(params) : '';
        return this.http.get<PaginatedResponse<PixKey>>(`${this.basePath}${query}`);
    }

    async get(key: string): Promise<MessageApiResponse<PixKey>> {
        return this.http.get<MessageApiResponse<PixKey>>(`${this.basePath}/${encodeURIComponent(key)}`);
    }

    async create(data: CreatePixKeyData): Promise<MessageApiResponse<PixKey>> {
        return this.http.post<MessageApiResponse<PixKey>>(this.basePath, data);
    }

    async delete(key: string): Promise<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.basePath}/${encodeURIComponent(key)}`);
    }

    async requestAuthCode(data: RequestPixKeyAuthCodeData): Promise<MessageApiResponse<PixKeyAuthCode>> {
        return this.http.post<MessageApiResponse<PixKeyAuthCode>>(`${this.basePath}/auth-code`, data);
    }
}
