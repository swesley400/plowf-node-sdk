import { TransfersService } from '../src/resources/transfers/transfers.service';
import { createMockHttpClient, MockHttpClient } from './mocks/http-client.mock';
import { Transfer, CreateTransferData } from '../src/resources/transfers/transfers.types';
import { ApiResponse, PaginatedResponse } from '../src/types/responses';

describe('TransfersService', () => {
    let service: TransfersService;
    let mockHttp: MockHttpClient;

    beforeEach(() => {
        mockHttp = createMockHttpClient();
        service = new TransfersService(mockHttp as any);
    });

    describe('list', () => {
        it('should list transfers without params', async () => {
            const mockResponse: PaginatedResponse<Transfer> = {
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

            expect(mockHttp.get).toHaveBeenCalledWith('/transfers');
            expect(result).toEqual(mockResponse);
        });

        it('should list transfers with params', async () => {
            const mockResponse: PaginatedResponse<Transfer> = {
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

            const result = await service.list({ status: 'PAID', page: 2 });

            expect(mockHttp.get).toHaveBeenCalledWith('/transfers?status=PAID&page=2');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should get a transfer by uuid', async () => {
            const mockTransfer: ApiResponse<Transfer> = {
                data: {
                    uuid: '550e8400-e29b-41d4-a716-446655440000',
                    value: 100.5,
                    fees: 0.5,
                    currency: 'BRL',
                    status: 'PAID',
                    type: 'PIX',
                    pix_key: '12345678900',
                    pix_holder_document: '12345678900',
                    external_ref: 'REF-001',
                    final_beneficiary: null,
                    transfer: null,
                    history: [],
                    created_at: '2024-01-01T11:59:00Z',
                },
            };
            mockHttp.get.mockResolvedValue(mockTransfer);

            const result = await service.get('550e8400-e29b-41d4-a716-446655440000');

            expect(mockHttp.get).toHaveBeenCalledWith('/transfers/550e8400-e29b-41d4-a716-446655440000');
            expect(result).toEqual(mockTransfer);
        });
    });

    describe('create', () => {
        it('should create a transfer', async () => {
            const createData: CreateTransferData = {
                value: 100.50,
                pix_key: '12345678900',
                external_ref: 'REF-001',
            };
            const mockResponse: ApiResponse<Transfer> = {
                data: {
                    uuid: '550e8400-e29b-41d4-a716-446655440000',
                    value: 100.50,
                    fees: 0.5,
                    currency: 'BRL',
                    status: 'PENDING',
                    type: 'PIX',
                    pix_key: '12345678900',
                    pix_holder_document: '12345678900',
                    external_ref: 'REF-001',
                    final_beneficiary: null,
                    transfer: null,
                    history: [],
                    created_at: '2024-01-01T11:59:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.create(createData);

            expect(mockHttp.post).toHaveBeenCalledWith('/transfers', createData);
            expect(result).toEqual(mockResponse);
        });

        it('should create a transfer with final_beneficiary', async () => {
            const createData: CreateTransferData = {
                value: 200,
                pix_key: '98765432100',
                final_beneficiary: {
                    name: 'Maria Santos',
                    document: '98765432100',
                },
            };
            const mockResponse: ApiResponse<Transfer> = {
                data: {
                    uuid: '550e8400-e29b-41d4-a716-446655440001',
                    value: 200,
                    fees: 1,
                    currency: 'BRL',
                    status: 'PENDING',
                    type: 'PIX',
                    pix_key: '98765432100',
                    pix_holder_document: '98765432100',
                    external_ref: null,
                    final_beneficiary: {
                        name: 'Maria Santos',
                        document: '98765432100',
                    },
                    transfer: null,
                    history: [],
                    created_at: '2024-01-01T12:00:00Z',
                },
            };
            mockHttp.post.mockResolvedValue(mockResponse);

            const result = await service.create(createData);

            expect(mockHttp.post).toHaveBeenCalledWith('/transfers', createData);
            expect(result.data.final_beneficiary).toEqual({
                name: 'Maria Santos',
                document: '98765432100',
            });
        });
    });
});
