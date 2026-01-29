import axios, { AxiosInstance, AxiosError } from 'axios';
import https from 'https';
import { HttpClientConfig, RequestConfig } from './types';
import {
    PlowfError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerError,
} from './errors';

export class HttpClient {
    private readonly instance: AxiosInstance;
    private readonly config: HttpClientConfig;

    constructor(config: HttpClientConfig) {
        this.config = config;
        
        const axiosConfig: Record<string, unknown> = {
            baseURL: config.baseURL,
            timeout: config.timeout ?? 30000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
        };

        if (config.rejectUnauthorized === false) {
            axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
        }

        this.instance = axios.create(axiosConfig);
    }

    private handleError(error: AxiosError): never {
        const status = error.response?.status ?? 0;
        const data = error.response?.data;
        const message = error.message;

        switch (status) {
            case 401:
                throw new AuthenticationError(message, data);
            case 403:
                throw new AuthorizationError(message, data);
            case 404:
                throw new NotFoundError(message, data);
            case 422:
                throw new ValidationError(message, data);
            case 500:
                throw new ServerError(message, data);
            default:
                throw new PlowfError(message, status, 'UNKNOWN_ERROR', data);
        }
    }

    async get<T>(url: string, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.instance.get<T>(url, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }

    async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.instance.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }

    async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.instance.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }

    async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.instance.patch<T>(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }

    async delete<T>(url: string, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.instance.delete<T>(url, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }
}
