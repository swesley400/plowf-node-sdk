import { HttpClient } from '../../http/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/responses';
import { toQueryString } from '../../utils/serializer';
import {
    Webhook,
    CreateWebhookData,
    ListWebhooksParams,
    DeleteWebhookResponse,
} from './webhooks.types';

export class WebhooksService {
    private readonly http: HttpClient;
    private readonly basePath = '/webhooks';

    constructor(http: HttpClient) {
        this.http = http;
    }

    async list(params?: ListWebhooksParams): Promise<PaginatedResponse<Webhook>> {
        const query = params ? toQueryString(params) : '';
        return this.http.get<PaginatedResponse<Webhook>>(`${this.basePath}${query}`);
    }

    async get(uuid: string): Promise<ApiResponse<Webhook>> {
        return this.http.get<ApiResponse<Webhook>>(`${this.basePath}/${uuid}`);
    }

    async create(data: CreateWebhookData): Promise<ApiResponse<Webhook>> {
        return this.http.post<ApiResponse<Webhook>>(this.basePath, data);
    }

    async delete(uuid: string): Promise<DeleteWebhookResponse> {
        return this.http.delete<DeleteWebhookResponse>(`${this.basePath}/${uuid}`);
    }
}
