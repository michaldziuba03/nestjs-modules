import { Logger } from "@nestjs/common";
import IORedis, { Redis, RedisOptions } from "ioredis";
import { RedisClientStatus, REDIS_BASE_TOKEN, REDIS_CONTEXT } from "./redis.constants";

export const logger = new Logger(REDIS_CONTEXT);

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