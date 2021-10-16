import { Test, TestingModule } from '@nestjs/testing';
import { Cluster } from 'ioredis';
import { RedisClusterModule, injectClusterToken } from '../../src';
import { nodes } from './nodes';

describe('Redis Cluster connection', () => {
    let module: TestingModule;
    let firstCluster: Cluster;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                RedisClusterModule.register({
                    nodes,
                })
            ]
        }).compile();

        module.enableShutdownHooks();
        // FIRST REDIS INSTANCE:
        const firstToken = injectClusterToken();
        firstCluster = module.get<Cluster>(firstToken);
    });

    it('shoud create foo key with bar as value', async () => {
        const foo = 'foo';
        const bar = 'bar';
        await firstCluster.set(foo, bar);
        const result = await firstCluster.get(foo);

        expect(result).toEqual(bar);
    });

    afterAll(async () => {
        await firstCluster.flushall();
        await module.close();
    });
});