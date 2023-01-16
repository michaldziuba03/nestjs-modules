import { Test } from '@nestjs/testing';
import { OtherModule, ScopedModule } from '../src/scoped.module';

describe('Test RedisModule scope (isGlobal option)', () => {
  it('should successfully compile module', async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [ScopedModule],
    });

    try {
      const moduleRef = await moduleBuilder.compile();
      expect(moduleRef).toBeDefined();
      await moduleRef.close();
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it('should fail inject non global Redis instance to OtherService', async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [ScopedModule, OtherModule],
    });

    try {
      const moduleRef = await moduleBuilder.compile();
      expect(moduleRef).toBeUndefined();
      await moduleRef.close();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
