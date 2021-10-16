import { injectClusterToken } from "../../src"

describe('Injection cluster token', () => {
    it('should return default token', () => {
        const token = injectClusterToken();
        expect(token).toContain('default');
    });

    it('should return conn1 token', () => {
        const clientName = 'conn1';
        const token = injectClusterToken(clientName);
        expect(token).toContain(clientName);
    });
});