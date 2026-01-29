export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginationParams {
    page?: number;
    per_page?: number;
}

export type ChargeStatus =
    | 'UNDEFINED'
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED'
    | 'CANCELLED'
    | 'EXPIRED'
    | 'PROCESSING';

export type ChargeType = 'UNDEFINED' | 'PIX';

export type TransferStatus =
    | 'UNDEFINED'
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED'
    | 'CANCELLED'
    | 'EXPIRED'
    | 'PROCESSING';

export type TransferType = 'UNDEFINED' | 'PIX';

export type WebhookStatus = 'ACTIVE' | 'INACTIVE';

export type AccountType = 'CHECKING' | 'SAVINGS';

export type PixType = 'QR_DYNAMIC' | 'QR_STATIC';

export type MovementType = 'IN' | 'OUT';

export interface Bank {
    code: string;
    name: string;
}

export interface Account {
    name: string;
    document: string;
    account_number: string;
    account_agency: string;
    bank: Bank;
    account_type: AccountType;
}

export interface FinalBeneficiary {
    name: string;
    document: string;
}

export interface StatusHistory {
    status: string;
    created_at: string;
}

export interface AdditionalInfo {
    name: string;
    value: string;
}
