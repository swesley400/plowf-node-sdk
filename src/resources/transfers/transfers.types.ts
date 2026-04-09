import {
    TransferStatus,
    TransferType,
    PaginationParams,
    FinalBeneficiary,
    StatusHistory,
    MovementType,
} from '../../types/common';

export interface TransferDetails {
    uuid: string;
    value: number;
    movement_type: MovementType;
    type: TransferType;
    status: string;
    end_to_end: string | null;
    error: string | null;
    settled_at: string | null;
    created_at: string;
}

export interface Transfer {
    uuid: string;
    value: number;
    fees: number;
    currency: string;
    status: TransferStatus;
    type: TransferType;
    pix_key: string;
    pix_holder_document: string;
    external_ref: string | null;
    final_beneficiary: FinalBeneficiary | null;
    transfer: TransferDetails | null;
    history: StatusHistory[];
    created_at: string;
}

export interface CreateTransferData {
    value: number;
    pix_key: string;
    document?: string;
    account_uuid?: string;
    external_ref?: string;
    final_beneficiary?: FinalBeneficiary;
}

export interface ListTransfersParams extends PaginationParams {
    uuid?: string;
    status?: TransferStatus;
    type?: TransferType;
    start_date?: string;
    end_date?: string;
    transfer_start_date?: string;
    transfer_end_date?: string;
}
