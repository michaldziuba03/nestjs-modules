import { Logger } from "@nestjs/common";
import IORedis, { Cluster, Redis, RedisOptions } from "ioredis";
import { RedisClientStatus, REDIS_BASE_TOKEN, REDIS_CONTEXT } from "./redis.constants";
import { ModuleOptions } from "./redis.interface";

export const logger = new Logger(REDIS_CONTEXT);

export function createClient(options: ModuleOptions) {
    const client = new IORedis(options);
    if (options.onReady) {
        options.onReady(client);
    }
    
    return client;
}

export async function shutdownClient(client: Redis | Cluster) {
    if (client.status === RedisClientStatus.READY) {
        await client.quit();
    }

    client.disconnect();
}

export function getConnectionToken(name: string) {
    return `${REDIS_BASE_TOKEN}${name}`;
}