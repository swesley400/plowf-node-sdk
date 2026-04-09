import { HttpClient } from '../../http/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/responses';
import { toQueryString } from '../../utils/serializer';
import {
    Med,
    ListMedsParams,
    ReplyMedData,
} from './meds.types';

export class MedsService {
    private readonly http: HttpClient;
    private readonly basePath = '/meds';

    constructor(http: HttpClient) {
        this.http = http;
    }

    async list(params?: ListMedsParams): Promise<PaginatedResponse<Med>> {
        const query = params ? toQueryString(params) : '';
        return this.http.get<PaginatedResponse<Med>>(`${this.basePath}${query}`);
    }

    async get(uuid: string): Promise<ApiResponse<Med>> {
        return this.http.get<ApiResponse<Med>>(`${this.basePath}/${uuid}`);
    }

    async reply(uuid: string, data: ReplyMedData): Promise<ApiResponse<Med>> {
        return this.http.post<ApiResponse<Med>>(`${this.basePath}/${uuid}/reply`, data);
    }
}
