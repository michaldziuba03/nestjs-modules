import IORedis, { Redis, RedisOptions } from "ioredis";
import { RedisClientStatus, REDIS_BASE_TOKEN } from "./redis.constants";

export function createClient(options: RedisOptions) {
    const client = new IORedis(options);
    return client;
}

export async function shutdownClient(client: Redis) {
    if (client.status === RedisClientStatus.READY) {
        await client.quit();
    }

    client.disconnect();
}

export function getConnectionToken(name: string) {
    return `${REDIS_BASE_TOKEN}${name}`;
}