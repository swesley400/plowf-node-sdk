import { PixKeysService } from '../src/resources/pix-keys/pix-keys.service';
import {
    CreatePixKeyData,
    MessageApiResponse,
    MessageResponse,
    PixKey,
    PixKeyAuthCode,
    RequestPixKeyAuthCodeData,
} from '../src/resources/pix-keys/pix-keys.types';
import { PaginatedResponse } from '../src/types/responses';
import { createMockHttpClient, MockHttpClient } from './mocks/http-client.mock';

describe('PixKeysService', () => {
    let service: PixKeysService;
    let mockHttp: MockHttpClient;

    beforeEach(() => {
        mockHttp = createMockHttpClient();
        service = new PixKeysService(mockHttp as any);
    });

    it('should list pix keys with filters', async () => {
        const mockResponse: PaginatedResponse<PixKey> = {
            data: [
                {
                    key: 'user@email.com',
                    type: 'EMAIL',
                    is_active: true,
                    created_at: '2024-01-01T00:00:00Z',
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

        const result = await service.list({ type: 'EMAIL', is_active: true });

        expect(mockHttp.get).toHaveBeenCalledWith('/pix-keys?type=EMAIL&is_active=true');
        expect(result).toEqual(mockResponse);
    });

    it('should get a pix key encoding the key path', async () => {
        const mockResponse: MessageApiResponse<PixKey> = {
            message: 'Chave PIX encontrada com sucesso.',
            data: {
                key: '+5511999999999',
                type: 'PHONE',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
        };
        mockHttp.get.mockResolvedValue(mockResponse);

        const result = await service.get('+5511999999999');

        expect(mockHttp.get).toHaveBeenCalledWith('/pix-keys/%2B5511999999999');
        expect(result).toEqual(mockResponse);
    });

    it('should create a pix key', async () => {
        const payload: CreatePixKeyData = {
            type: 'RANDOM',
        };
        const mockResponse: MessageApiResponse<PixKey> = {
            message: 'Chave PIX criada com sucesso.',
            data: {
                key: '550e8400-e29b-41d4-a716-446655440000',
                type: 'RANDOM',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
        };
        mockHttp.post.mockResolvedValue(mockResponse);

        const result = await service.create(payload);

        expect(mockHttp.post).toHaveBeenCalledWith('/pix-keys', payload);
        expect(result).toEqual(mockResponse);
    });

    it('should delete a pix key encoding email path', async () => {
        const mockResponse: MessageResponse = {
            message: 'Chave PIX removida com sucesso.',
        };
        mockHttp.delete.mockResolvedValue(mockResponse);

        const result = await service.delete('user@email.com');

        expect(mockHttp.delete).toHaveBeenCalledWith('/pix-keys/user%40email.com');
        expect(result).toEqual(mockResponse);
    });

    it('should request auth code for pix key verification', async () => {
        const payload: RequestPixKeyAuthCodeData = {
            key: 'user@email.com',
        };
        const mockResponse: MessageApiResponse<PixKeyAuthCode> = {
            message: 'Codigo de autenticacao enviado com sucesso.',
            data: {
                auth_code_id: 'abc123xyz',
            },
        };
        mockHttp.post.mockResolvedValue(mockResponse);

        const result = await service.requestAuthCode(payload);

        expect(mockHttp.post).toHaveBeenCalledWith('/pix-keys/auth-code', payload);
        expect(result).toEqual(mockResponse);
    });
});
