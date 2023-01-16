import { injectCassandraToken } from '../lib';

describe('Injection token', () => {
  it('should return default token', () => {
    const token = injectCassandraToken();
    expect(token).toContain('default');
  });

  it('should return conn1 token', () => {
    const clientName = 'conn1';
    const token = injectCassandraToken(clientName);
    expect(token).toContain(clientName);
  });
});
