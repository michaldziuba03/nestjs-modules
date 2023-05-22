import { injectClickHouse } from '../lib';

describe('Injection token', () => {
  it('should return default token', () => {
    const token = injectClickHouse();
    expect(token).toContain('default');
  });

  it('should return conn1 token', () => {
    const clientName = 'conn1';
    const token = injectClickHouse(clientName);
    expect(token).toContain(clientName);
  });
});
