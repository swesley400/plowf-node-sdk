import { HttpClient } from '../../http/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/responses';
import { toQueryString } from '../../utils/serializer';
import {
    Transfer,
    CreateTransferData,
    ListTransfersParams,
} from './transfers.types';

export class TransfersService {
    private readonly http: HttpClient;
    private readonly basePath = '/transfers';

    constructor(http: HttpClient) {
        this.http = http;
    }

    async list(params?: ListTransfersParams): Promise<PaginatedResponse<Transfer>> {
        const query = params ? toQueryString(params) : '';
        return this.http.get<PaginatedResponse<Transfer>>(`${this.basePath}${query}`);
    }

    async get(uuid: string): Promise<ApiResponse<Transfer>> {
        return this.http.get<ApiResponse<Transfer>>(`${this.basePath}/${uuid}`);
    }

    async create(data: CreateTransferData): Promise<ApiResponse<Transfer>> {
        return this.http.post<ApiResponse<Transfer>>(this.basePath, data);
    }
}
