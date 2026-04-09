import {
    ChargeStatus,
    ChargeType,
    PaginationParams,
    FinalBeneficiary,
    StatusHistory,
    Account,
    AdditionalInfo,
    PixType,
    SplitType,
    SplitStatus,
} from '../../types/common';

export interface PixDetails {
    sender: Account | null;
    receiver: Account | null;
    txid: string;
    value: number;
    type: PixType;
    additional_info: AdditionalInfo[];
    transaction: unknown | null;
    status: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentDetails {
    uuid: string;
    value: number;
    type: ChargeType;
    status: string;
    payload: string;
    pix: PixDetails | null;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface SplitRecipientAccount {
    uuid: string;
    name: string;
}

export interface Split {
    uuid: string;
    type: SplitType;
    value: number;
    status: SplitStatus;
    recipient_account: SplitRecipientAccount;
}

export interface CreateSplitData {
    type: 'percentage' | 'fixed';
    value: number;
    recipient_account_uuid: string;
}

export interface Charge {
    uuid: string;
    value: number;
    total_value: number;
    fees: number;
    currency: string;
    status: ChargeStatus;
    type: ChargeType;
    payment: PaymentDetails | null;
    external_ref: string | null;
    final_beneficiary: FinalBeneficiary | null;
    splits: Split[];
    history: StatusHistory[];
    created_at: string;
    updated_at: string;
}

export interface CreateChargeData {
    type: 'pix';
    value: number;
    external_ref?: string;
    final_beneficiary?: FinalBeneficiary;
    splits?: CreateSplitData[];
}

export interface RefundChargeData {
    value?: number;
}

export interface RefundResponse {
    uuid: string;
    status: string;
    value: number;
    fees: number;
    created_at: string;
    updated_at: string;
}

export interface ListChargesParams extends PaginationParams {
    uuid?: string;
    status?: ChargeStatus;
    type?: ChargeType;
    end_to_end?: string;
    charge_start_date?: string;
    charge_end_date?: string;
    start_date?: string;
    end_date?: string;
}
