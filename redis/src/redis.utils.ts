import { Logger } from "@nestjs/common";
import IORedis from "ioredis";
import { DuplicationError } from "./errors/DuplicationError";
import { DEFAULT_CONNECTION_NAME, REDIS_BASE_TOKEN, REDIS_CONTEXT } from "./redis.constants";
import { RedisModuleOptions } from "./redis.interface";

export const logger = new Logger(REDIS_CONTEXT);

const tokens: string[] = []
export function validateRedisToken(token: string = DEFAULT_CONNECTION_NAME) {
    if (tokens.includes(token)) {
        throw new DuplicationError('Connection', token);
    }

    tokens.push(token);
}

export function createClient(options: RedisModuleOptions) {
    const client = new IORedis(options);
    if (options.onReady) {
        options.onReady(client);
    }
    
    return client;
}

export function getConnectionToken(name: string) {
    return `${REDIS_BASE_TOKEN}${name}`;
}