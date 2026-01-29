import axios from 'axios';
import { HttpClient } from '../src/http/http-client';
import {
    PlowfError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerError,
} from '../src/http/errors';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
    let client: HttpClient;
    let mockAxiosInstance: any;

    beforeEach(() => {
        mockAxiosInstance = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
        };
        mockedAxios.create.mockReturnValue(mockAxiosInstance);

        client = new HttpClient({
            baseURL: 'https://app.plowf.com/api/v1',
            apiKey: 'test_api_key',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should make GET request and return data', async () => {
            const mockData = { data: { id: 1 } };
            mockAxiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await client.get('/test');

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
            expect(result).toEqual(mockData);
        });
    });

    describe('post', () => {
        it('should make POST request and return data', async () => {
            const mockData = { data: { id: 1 } };
            const postData = { name: 'test' };
            mockAxiosInstance.post.mockResolvedValue({ data: mockData });

            const result = await client.post('/test', postData);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData, undefined);
            expect(result).toEqual(mockData);
        });
    });

    describe('put', () => {
        it('should make PUT request and return data', async () => {
            const mockData = { data: { id: 1 } };
            const putData = { name: 'updated' };
            mockAxiosInstance.put.mockResolvedValue({ data: mockData });

            const result = await client.put('/test', putData);

            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', putData, undefined);
            expect(result).toEqual(mockData);
        });
    });

    describe('patch', () => {
        it('should make PATCH request and return data', async () => {
            const mockData = { data: { id: 1 } };
            const patchData = { name: 'patched' };
            mockAxiosInstance.patch.mockResolvedValue({ data: mockData });

            const result = await client.patch('/test', patchData);

            expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test', patchData, undefined);
            expect(result).toEqual(mockData);
        });
    });

    describe('delete', () => {
        it('should make DELETE request and return data', async () => {
            const mockData = { message: 'deleted' };
            mockAxiosInstance.delete.mockResolvedValue({ data: mockData });

            const result = await client.delete('/test/1');

            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
            expect(result).toEqual(mockData);
        });
    });

    describe('error handling', () => {
        it('should throw AuthenticationError on 401', async () => {
            const error = {
                response: { status: 401, data: { error: 'Unauthorized' } },
                message: 'Request failed',
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(client.get('/test')).rejects.toThrow(AuthenticationError);
        });

        it('should throw AuthorizationError on 403', async () => {
            const error = {
                response: { status: 403, data: { error: 'Forbidden' } },
                message: 'Request failed',
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(client.get('/test')).rejects.toThrow(AuthorizationError);
        });

        it('should throw NotFoundError on 404', async () => {
            const error = {
                response: { status: 404, data: { error: 'Not found' } },
                message: 'Request failed',
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(client.get('/test')).rejects.toThrow(NotFoundError);
        });

        it('should throw ValidationError on 422', async () => {
            const error = {
                response: { status: 422, data: { errors: { field: ['invalid'] } } },
                message: 'Request failed',
            };
            mockAxiosInstance.post.mockRejectedValue(error);

            await expect(client.post('/test', {})).rejects.toThrow(ValidationError);
        });

        it('should throw ServerError on 500', async () => {
            const error = {
                response: { status: 500, data: { error: 'Internal error' } },
                message: 'Request failed',
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(client.get('/test')).rejects.toThrow(ServerError);
        });

        it('should throw PlowfError on unknown status', async () => {
            const error = {
                response: { status: 418, data: { error: "I'm a teapot" } },
                message: 'Request failed',
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(client.get('/test')).rejects.toThrow(PlowfError);
        });

        it('should throw PlowfError with status 0 when no response', async () => {
            const error = {
                message: 'Network error',
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            try {
                await client.get('/test');
            } catch (e) {
                expect(e).toBeInstanceOf(PlowfError);
                expect((e as PlowfError).status).toBe(0);
            }
        });
    });
});
