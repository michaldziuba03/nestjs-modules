import { Test, TestingModule } from '@nestjs/testing';
import { Cluster, ClusterNode } from 'ioredis';
import { RedisClusterModule, injectClusterToken } from '../../src';

const nodes: ClusterNode[] = [
    { host: 'localhost', port: 7000 },
    { host: 'localhost', port: 7001 },
    { host: 'localhost', port: 7002 },
    { host: 'localhost', port: 7003 },
    { host: 'localhost', port: 7004 },
    { host: 'localhost', port: 7005 },
    { host: 'localhost', port: 7006 },
    { host: 'localhost', port: 7007 }
]

describe('Redis Cluster connection', () => {
    let module: TestingModule;
    let firstCluster: Cluster;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                RedisClusterModule.register({
                    nodes,
                    onReady: () => {
                        console.log('Ready to use');
                    }
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
        //await firstCluster.flushall();
        await module.close();
    });
});