export class PlowfError extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly data: unknown;

    constructor(message: string, status: number, code: string, data: unknown = null) {
        super(message);
        this.name = 'PlowfError';
        this.status = status;
        this.code = code;
        this.data = data;
    }
}

export class AuthenticationError extends PlowfError {
    constructor(message = 'Não autenticado', data: unknown = null) {
        super(message, 401, 'UNAUTHENTICATED', data);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends PlowfError {
    constructor(message = 'Não autorizado', data: unknown = null) {
        super(message, 403, 'UNAUTHORIZED', data);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends PlowfError {
    constructor(message = 'Recurso não encontrado', data: unknown = null) {
        super(message, 404, 'NOT_FOUND', data);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends PlowfError {
    constructor(message = 'Erro de validação', data: unknown = null) {
        super(message, 422, 'VALIDATION_ERROR', data);
        this.name = 'ValidationError';
    }
}

export class ServerError extends PlowfError {
    constructor(message = 'Erro interno do servidor', data: unknown = null) {
        super(message, 500, 'SERVER_ERROR', data);
        this.name = 'ServerError';
    }
}
