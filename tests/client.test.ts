import { PlowfClient } from '../src/client';
import { PaymentsService } from '../src/resources/payments/payments.service';
import { TransfersService } from '../src/resources/transfers/transfers.service';
import { WebhooksService } from '../src/resources/webhooks/webhooks.service';
import { PixKeysService } from '../src/resources/pix-keys/pix-keys.service';

describe('PlowfClient', () => {
    it('should create client with required config', () => {
        const client = new PlowfClient({
            apiKey: 'test_api_key',
        });

        expect(client).toBeInstanceOf(PlowfClient);
        expect(client.payments).toBeInstanceOf(PaymentsService);
        expect(client.transfers).toBeInstanceOf(TransfersService);
        expect(client.webhooks).toBeInstanceOf(WebhooksService);
        expect(client.pixKeys).toBeInstanceOf(PixKeysService);
    });

    it('should create client with custom config', () => {
        const client = new PlowfClient({
            apiKey: 'test_api_key',
            timeout: 60000,
            retries: 5,
        });

        expect(client).toBeInstanceOf(PlowfClient);
    });

    it('should have all services available', () => {
        const client = new PlowfClient({
            apiKey: 'test_api_key',
        });

        expect(client.payments).toBeDefined();
        expect(client.transfers).toBeDefined();
        expect(client.webhooks).toBeDefined();
        expect(client.pixKeys).toBeDefined();
    });
});
