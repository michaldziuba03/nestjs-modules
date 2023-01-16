import { RedisModule } from '../../../lib';
import { port1, host, port2 } from '../src/options';

const createModules = () => {
  return {
    imports: [
      RedisModule.forRoot({
        name: 'duplicated',
        host,
        port: port1,
      }),
      RedisModule.forRootAsync({
        name: 'duplicated',
        useFactory: () => ({
          host,
          port: port2,
        }),
      }),
    ],
  };
};

describe('Redis connections duplication', () => {
  it('should throw duplication error', async () => {
    expect(createModules).toThrow();
  });
});
