import { PaginationParams, Account } from '../../types/common';

export type MedStatus = 'PENDING' | 'PROCESSING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export type MedType = 'RECEIVED_MED' | 'REQUESTED_MED';

export type DisputeType = 'UNDEFINED' | 'SCAM' | 'WRONG_TRANSACTION' | 'COERCION_CRIME' | 'UNAUTHORIZED_ACCESS';

export interface MedAttachment {
    uuid: string;
    url: string;
}

export interface PixInitiation {
    sender: Account | null;
    receiver: Account | null;
    txid: string | null;
    value: string;
    type: string;
    pix_key?: string;
    additional_info?: Array<{ name: string; value: string }>;
    status: string;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PixTransaction {
    uuid: string;
    initiation: PixInitiation;
    value: string;
    movement_type: 'IN' | 'OUT';
    type: string;
    status: string;
    end_to_end: string | null;
    settled_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Med {
    uuid: string;
    pix_in_transaction: PixTransaction;
    attachments: MedAttachment[];
    med_type: MedType;
    dispute_type: DisputeType;
    status: MedStatus;
    details: string | null;
    analysis: string | null;
    resolved: boolean;
    created_at: string;
    updated_at: string;
}

export interface ListMedsParams extends PaginationParams {
    uuid?: string;
    status?: MedStatus;
    med_type?: MedType;
    dispute_type?: DisputeType;
    resolved?: boolean;
    start_date?: string;
    end_date?: string;
}

export interface ReplyMedData {
    accept: boolean;
    analysis: string;
}
