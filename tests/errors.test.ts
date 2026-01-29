import {
    PlowfError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerError,
} from '../src/http/errors';

describe('Errors', () => {
    describe('PlowfError', () => {
        it('should create error with all properties', () => {
            const error = new PlowfError('Test error', 400, 'TEST_ERROR', { field: 'value' });

            expect(error.message).toBe('Test error');
            expect(error.status).toBe(400);
            expect(error.code).toBe('TEST_ERROR');
            expect(error.data).toEqual({ field: 'value' });
            expect(error.name).toBe('PlowfError');
        });

        it('should be instance of Error', () => {
            const error = new PlowfError('Test', 400, 'TEST', null);
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('AuthenticationError', () => {
        it('should create with default message', () => {
            const error = new AuthenticationError();

            expect(error.message).toBe('Não autenticado');
            expect(error.status).toBe(401);
            expect(error.code).toBe('UNAUTHENTICATED');
            expect(error.name).toBe('AuthenticationError');
        });

        it('should create with custom message', () => {
            const error = new AuthenticationError('Token expirado', { reason: 'expired' });

            expect(error.message).toBe('Token expirado');
            expect(error.data).toEqual({ reason: 'expired' });
        });
    });

    describe('AuthorizationError', () => {
        it('should create with default message', () => {
            const error = new AuthorizationError();

            expect(error.message).toBe('Não autorizado');
            expect(error.status).toBe(403);
            expect(error.code).toBe('UNAUTHORIZED');
            expect(error.name).toBe('AuthorizationError');
        });
    });

    describe('NotFoundError', () => {
        it('should create with default message', () => {
            const error = new NotFoundError();

            expect(error.message).toBe('Recurso não encontrado');
            expect(error.status).toBe(404);
            expect(error.code).toBe('NOT_FOUND');
            expect(error.name).toBe('NotFoundError');
        });
    });

    describe('ValidationError', () => {
        it('should create with default message', () => {
            const error = new ValidationError();

            expect(error.message).toBe('Erro de validação');
            expect(error.status).toBe(422);
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.name).toBe('ValidationError');
        });

        it('should store validation errors in data', () => {
            const validationData = {
                errors: {
                    value: ['O campo value é obrigatório'],
                    type: ['O campo type deve ser pix'],
                },
            };
            const error = new ValidationError('Dados inválidos', validationData);

            expect(error.data).toEqual(validationData);
        });
    });

    describe('ServerError', () => {
        it('should create with default message', () => {
            const error = new ServerError();

            expect(error.message).toBe('Erro interno do servidor');
            expect(error.status).toBe(500);
            expect(error.code).toBe('SERVER_ERROR');
            expect(error.name).toBe('ServerError');
        });
    });
});
