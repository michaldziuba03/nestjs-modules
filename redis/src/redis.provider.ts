import Redis, { RedisOptions } from 'ioredis';

function createClient(options: RedisOptions) {
    const redis = new Redis(options);
    return redis;
}