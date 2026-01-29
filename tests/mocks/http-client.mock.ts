export const createMockHttpClient = () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
});

export type MockHttpClient = ReturnType<typeof createMockHttpClient>;
