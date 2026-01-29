import { WebhooksService } from '../src/resources/webhooks/webhooks.service';
import { createMockHttpClient, MockHttpClient } from './mocks/http-client.mock';
import { Webhook, CreateWebhookData, DeleteWebhookResponse } from '../src/resources/webhooks/webhooks.types';
import { ApiResponse, PaginatedResponse } from '../src/types/responses';

describe('WebhooksService', () => {
    let service: WebhooksService;
    let mockHttp: MockHttpClient;

    beforeEach(() => {
        mockHttp = createMockHttpClient();
        service = new WebhooksService(mockHttp as any);
    });

    describe('list', () => {
        it('should list webhooks without params', async () => {
            const mockResponse: PaginatedResponse<Webhook> = {
                data: [],
                meta: {
                    current_page: 1,
                    from: 1,
                    last_page: 1,
                    per_page: 10,
                    to: 0,
                    total: 0,
                },
            };
            mockHttp.get.mockResolvedValue(mockResponse);

            const result = await service.list();

            expect(mockHttp.get).toHaveBeenCalledWith('/webhooks');
            expect(result).toEqual(mockResponse);
        });

        it('should list webhooks with status filter', async () => {
            const mockResponse: PaginatedResponse<Webhook> = {
                data: [
                    {
                        uuid: 'e1afe0f4-9358-4a50-b0fd-55912ca86ee1',
                        url: 'https://webhook.site/test',
                        token: 'abc123',
                        status: 'ACTIVE',
                        created_at: '2024-01-01T10:00:00Z',
                    },
                ],
                meta: {
                    current_page: 1,
                    from: 1,
                    last_page: 1,
                    per_page: 10,
                    to: 1,
                    total: 1,
                },
            };
            mockHttp.get.mockResolvedValue(mockResponse);

            const result = await service.list({ status: 'ACTIVE' });

            expect(mockHttp.get).toHaveBeenCalledWith('/webhooks?status=ACTIVE');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should get a webhook by uuid', async () => {
            const mockWebhook: ApiResponse<Webhook> = {
                data: {
                    uuid: 'e1afe0f4-9358-4a50-b0fd-55912ca86ee1',
                    url: 'https://webhook.site/test',
                    token: 'abc123',
                    status: 'ACTIVE',
                    created_at: '2024-01-01T10:00:00Z',
                },
            };
            mockHttp.get.mockResolvedValue(mockWebhook);

            const result = await service.get('e1afe0f4-9358-4a50-b0fd-55912ca86ee1');

            expect(mockHttp.get).toHaveBeenCalledWith('/webhooks/e1afe0f4-9358-4a50-b0fd-55912ca86ee1');
            expect(result).toEqual(mockWebhook);
        });
    });

    describe('create', () => {
        it('should create a webhook with url only', async () => {
            const createData: CreateWebhookData = {
                url: 'https://api.exemplo.com/webhooks',
            };
            const mockResponse: ApiResponse<Webhook> = {
                data: {
                    uuid: 'e1afe0f4-9358-4a50-b0fd-55912ca86ee1',
                    url: 'https://api.exemplo.com/webhooks',
                    token: 'generated_token_123',
                    status: 'ACTIVE',
                    created_at: '2024-01-01T10:00:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.create(createData);

            expect(mockHttp.post).toHaveBeenCalledWith('/webhooks', createData);
            expect(result).toEqual(mockResponse);
        });

        it('should create a webhook with custom token', async () => {
            const createData: CreateWebhookData = {
                url: 'https://api.exemplo.com/webhooks',
                token: 'my_custom_token',
            };
            const mockResponse: ApiResponse<Webhook> = {
                data: {
                    uuid: 'e1afe0f4-9358-4a50-b0fd-55912ca86ee1',
                    url: 'https://api.exemplo.com/webhooks',
                    token: 'my_custom_token',
                    status: 'ACTIVE',
                    created_at: '2024-01-01T10:00:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.create(createData);

            expect(mockHttp.post).toHaveBeenCalledWith('/webhooks', createData);
            expect(result.data.token).toBe('my_custom_token');
        });
    });

    describe('delete', () => {
        it('should delete a webhook', async () => {
            const mockResponse: DeleteWebhookResponse = {
                message: 'Webhook deletado com sucesso',
            };
            mockHttp.delete.mockResolvedValue(mockResponse);

            const result = await service.delete('e1afe0f4-9358-4a50-b0fd-55912ca86ee1');

            expect(mockHttp.delete).toHaveBeenCalledWith('/webhooks/e1afe0f4-9358-4a50-b0fd-55912ca86ee1');
            expect(result).toEqual(mockResponse);
        });
    });
});
