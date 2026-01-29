import { toQueryString, parseDate, formatDate } from '../src/utils/serializer';
import { withRetry } from '../src/utils/retry';

describe('Serializer Utils', () => {
    describe('toQueryString', () => {
        it('should return empty string for empty object', () => {
            expect(toQueryString({})).toBe('');
        });

        it('should convert object to query string', () => {
            const result = toQueryString({ page: 1, per_page: 10 });
            expect(result).toBe('?page=1&per_page=10');
        });

        it('should ignore undefined values', () => {
            const result = toQueryString({ page: 1, status: undefined });
            expect(result).toBe('?page=1');
        });

        it('should ignore null values', () => {
            const result = toQueryString({ page: 1, status: null });
            expect(result).toBe('?page=1');
        });

        it('should handle string values', () => {
            const result = toQueryString({ status: 'PAID', type: 'PIX' });
            expect(result).toBe('?status=PAID&type=PIX');
        });
    });

    describe('parseDate', () => {
        it('should return null for null input', () => {
            expect(parseDate(null)).toBeNull();
        });

        it('should return null for undefined input', () => {
            expect(parseDate(undefined)).toBeNull();
        });

        it('should parse ISO date string', () => {
            const result = parseDate('2024-01-01T10:00:00Z');
            expect(result).toBeInstanceOf(Date);
            expect(result?.toISOString()).toBe('2024-01-01T10:00:00.000Z');
        });
    });

    describe('formatDate', () => {
        it('should format date to ISO string', () => {
            const date = new Date('2024-01-01T10:00:00Z');
            expect(formatDate(date)).toBe('2024-01-01T10:00:00.000Z');
        });
    });
});

describe('Retry Utils', () => {
    describe('withRetry', () => {
        it('should return result on first success', async () => {
            const fn = jest.fn().mockResolvedValue('success');

            const result = await withRetry(fn, { maxRetries: 3, delay: 10 });

            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('should retry on failure and succeed', async () => {
            const fn = jest.fn()
                .mockRejectedValueOnce(new Error('fail 1'))
                .mockRejectedValueOnce(new Error('fail 2'))
                .mockResolvedValue('success');

            const result = await withRetry(fn, { maxRetries: 3, delay: 10 });

            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(3);
        });

        it('should throw after max retries', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('always fails'));

            await expect(withRetry(fn, { maxRetries: 2, delay: 10 })).rejects.toThrow('always fails');
            expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
        });

        it('should use default options', async () => {
            const fn = jest.fn().mockResolvedValue('success');

            const result = await withRetry(fn);

            expect(result).toBe('success');
        });
    });
});
