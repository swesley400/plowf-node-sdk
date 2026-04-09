import { PaymentsService } from '../src/resources/payments/payments.service';
import { createMockHttpClient, MockHttpClient } from './mocks/http-client.mock';
import { Charge, CreateChargeData, RefundResponse } from '../src/resources/payments/payments.types';
import { ApiResponse, PaginatedResponse } from '../src/types/responses';

describe('PaymentsService', () => {
    let service: PaymentsService;
    let mockHttp: MockHttpClient;

    beforeEach(() => {
        mockHttp = createMockHttpClient();
        service = new PaymentsService(mockHttp as any);
    });

    describe('list', () => {
        it('should list charges without params', async () => {
            const mockResponse: PaginatedResponse<Charge> = {
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

            expect(mockHttp.get).toHaveBeenCalledWith('/payments');
            expect(result).toEqual(mockResponse);
        });

        it('should list charges with params', async () => {
            const mockResponse: PaginatedResponse<Charge> = {
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

            const result = await service.list({ status: 'PAID', page: 1, per_page: 10 });

            expect(mockHttp.get).toHaveBeenCalledWith('/payments?status=PAID&page=1&per_page=10');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should get a charge by uuid', async () => {
            const mockCharge: ApiResponse<Charge> = {
                data: {
                    uuid: '770e8400-e29b-41d4-a716-446655440000',
                    value: 100,
                    total_value: 105,
                    fees: 5,
                    currency: 'BRL',
                    status: 'PAID',
                    type: 'PIX',
                    payment: null,
                    external_ref: null,
                    final_beneficiary: null,
                    splits: [],
                    history: [],
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T10:00:00Z',
                },
            };
            mockHttp.get.mockResolvedValue(mockCharge);

            const result = await service.get('770e8400-e29b-41d4-a716-446655440000');

            expect(mockHttp.get).toHaveBeenCalledWith('/payments/770e8400-e29b-41d4-a716-446655440000');
            expect(result).toEqual(mockCharge);
        });
    });

    describe('create', () => {
        it('should create a charge', async () => {
            const createData: CreateChargeData = {
                type: 'pix',
                value: 100.50,
                external_ref: 'PED-001',
            };
            const mockResponse: ApiResponse<Charge> = {
                data: {
                    uuid: '770e8400-e29b-41d4-a716-446655440000',
                    value: 100.50,
                    total_value: 105.50,
                    fees: 5,
                    currency: 'BRL',
                    status: 'PENDING',
                    type: 'PIX',
                    payment: null,
                    external_ref: 'PED-001',
                    final_beneficiary: null,
                    splits: [],
                    history: [],
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T10:00:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.create(createData);

            expect(mockHttp.post).toHaveBeenCalledWith('/payments', createData);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('refund', () => {
        it('should refund a charge completely', async () => {
            const mockResponse: ApiResponse<RefundResponse> = {
                data: {
                    uuid: '770e8400-e29b-41d4-a716-446655440000',
                    status: 'PROCESSING',
                    value: 100,
                    fees: 1,
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T11:00:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.refund('770e8400-e29b-41d4-a716-446655440000');

            expect(mockHttp.post).toHaveBeenCalledWith('/payments/770e8400-e29b-41d4-a716-446655440000/refund', undefined);
            expect(result).toEqual(mockResponse);
        });

        it('should refund a charge partially', async () => {
            const mockResponse: ApiResponse<RefundResponse> = {
                data: {
                    uuid: '770e8400-e29b-41d4-a716-446655440000',
                    status: 'PROCESSING',
                    value: 50,
                    fees: 0.5,
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T11:00:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.refund('770e8400-e29b-41d4-a716-446655440000', { value: 50 });

            expect(mockHttp.post).toHaveBeenCalledWith('/payments/770e8400-e29b-41d4-a716-446655440000/refund', { value: 50 });
            expect(result).toEqual(mockResponse);
        });
    });
});
