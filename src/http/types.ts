import { AxiosRequestConfig } from 'axios';

export interface HttpClientConfig {
    baseURL: string;
    apiKey: string;
    timeout?: number;
    retries?: number;
    rejectUnauthorized?: boolean;
}

export interface RequestConfig extends Omit<AxiosRequestConfig, 'baseURL'> {
    skipAuth?: boolean;
}

export interface HttpResponse<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
}
