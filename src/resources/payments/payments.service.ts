import { HttpClient } from '../../http/http-client';
import { ApiResponse, PaginatedResponse } from '../../types/responses';
import { toQueryString } from '../../utils/serializer';
import {
    Charge,
    CreateChargeData,
    RefundChargeData,
    RefundResponse,
    ListChargesParams,
} from './payments.types';

export class PaymentsService {
    private readonly http: HttpClient;
    private readonly basePath = '/payments';

    constructor(http: HttpClient) {
        this.http = http;
    }

    async list(params?: ListChargesParams): Promise<PaginatedResponse<Charge>> {
        const query = params ? toQueryString(params) : '';
        return this.http.get<PaginatedResponse<Charge>>(`${this.basePath}${query}`);
    }

    async get(uuid: string): Promise<ApiResponse<Charge>> {
        return this.http.get<ApiResponse<Charge>>(`${this.basePath}/${uuid}`);
    }

    async create(data: CreateChargeData): Promise<ApiResponse<Charge>> {
        return this.http.post<ApiResponse<Charge>>(this.basePath, data);
    }

    async refund(uuid: string, data?: RefundChargeData): Promise<ApiResponse<RefundResponse>> {
        return this.http.post<ApiResponse<RefundResponse>>(`${this.basePath}/${uuid}/refund`, data);
    }
}
