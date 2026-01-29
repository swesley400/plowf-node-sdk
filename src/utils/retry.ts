export interface RetryOptions {
    maxRetries: number;
    delay: number;
    backoff?: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
    maxRetries: 3,
    delay: 1000,
    backoff: 2,
};

export async function withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const { maxRetries, delay, backoff } = { ...DEFAULT_OPTIONS, ...options };
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries) {
                const waitTime = delay * Math.pow(backoff!, attempt);
                await sleep(waitTime);
            }
        }
    }

    throw lastError;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
