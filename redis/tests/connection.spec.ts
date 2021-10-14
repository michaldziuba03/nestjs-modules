import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { RedisModule, injectRedisToken } from '../src';

describe('Redis connection', () => {
    let redisClient: Redis;
    let secondRedis: Redis;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                RedisModule.register({
                    host: 'localhost',
                    port: 2137.
                }),
                RedisModule.registerAsync({
                    name: 'second',
                    useFactory: () => ({
                        host: 'localhost',
                        port: 2138,
                    })
                }),
            ]
        }).compile();

        module.enableShutdownHooks();
        // FIRST REDIS INSTANCE:
        const token = injectRedisToken();
        redisClient = module.get<Redis>(token);
        // SECOND REDIS INSTANCE:
        const secondToken = injectRedisToken('second');
        secondRedis = module.get<Redis>(secondToken);
    });

    afterAll(async () => {
        await redisClient.flushall();
        await secondRedis.flushall();
        await module.close();
    });

    const key = 'HELLO';
    const value = 'WORLD';

    it('should successfully create HELLO key', async () => {
        
        await redisClient.set(key, value);

        const testResult = await redisClient.get(key);
        console.log(testResult);
        expect(testResult).toEqual(value);
    });

    it('should check if redis connections colision is possible', async () => {
        const result = await secondRedis.get(key);
        expect(result).toBeFalsy();

        const originalResult = await redisClient.get(key);
        expect(originalResult).not.toEqual(result);
    });
});