import { Test } from '@nestjs/testing';
import { OtherModule, ScopedModule } from '../src/scoped.module';

describe('Test RedisModule scope (isGlobal option)', () => {
  it('should successfully compile module', () => {
    const module = Test.createTestingModule({
      imports: [ScopedModule],
    }).compile();

    expect(module).resolves.toBeDefined();
  });

  it('should fail inject non global Redis instance to OtherService', () => {
    const module = Test.createTestingModule({
      imports: [ScopedModule, OtherModule],
    }).compile();

    expect(module).rejects.toBeDefined();
  });
});
