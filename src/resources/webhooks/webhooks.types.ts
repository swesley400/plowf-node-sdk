import { WebhookStatus, PaginationParams } from '../../types/common';

export interface Webhook {
    uuid: string;
    url: string;
    token: string;
    status: WebhookStatus;
    created_at: string;
}

export interface CreateWebhookData {
    url: string;
    token?: string;
}

export interface ListWebhooksParams extends PaginationParams {
    status?: WebhookStatus;
}

export interface DeleteWebhookResponse {
    message: string;
}
