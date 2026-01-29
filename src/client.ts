import { PlowfConfig, mergeConfig } from './config';
import { HttpClient } from './http/http-client';
import { PaymentsService, TransfersService, WebhooksService } from './resources';

export class PlowfClient {
    public readonly payments: PaymentsService;
    public readonly transfers: TransfersService;
    public readonly webhooks: WebhooksService;

    private readonly http: HttpClient;
    private readonly config: Required<PlowfConfig> & { baseURL: string };

    constructor(config: PlowfConfig) {
        this.config = mergeConfig(config);

        this.http = new HttpClient({
            baseURL: this.config.baseURL,
            apiKey: this.config.apiKey,
            timeout: this.config.timeout,
            retries: this.config.retries,
            rejectUnauthorized: this.config.rejectUnauthorized,
        });

        this.payments = new PaymentsService(this.http);
        this.transfers = new TransfersService(this.http);
        this.webhooks = new WebhooksService(this.http);
    }
}
