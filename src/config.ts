export const BASE_URL = 'https://app.plowf.com/api/v1';

export interface PlowfConfig {
    apiKey: string;
    timeout?: number;
    retries?: number;
    rejectUnauthorized?: boolean;
}

export const DEFAULT_CONFIG = {
    timeout: 30000,
    retries: 3,
};

export function mergeConfig(config: PlowfConfig): Required<PlowfConfig> & { baseURL: string } {
    return {
        baseURL: BASE_URL,
        timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
        retries: config.retries ?? DEFAULT_CONFIG.retries,
        rejectUnauthorized: config.rejectUnauthorized ?? true,
        apiKey: config.apiKey,
    };
}
