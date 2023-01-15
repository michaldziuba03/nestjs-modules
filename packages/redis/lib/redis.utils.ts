import { Logger } from '@nestjs/common';
import IORedis from 'ioredis';
import {
  DEFAULT_CONNECTION_NAME,
  REDIS_BASE_TOKEN,
  REDIS_CONTEXT,
} from './redis.constants';
import { RedisModuleOptions } from './redis.interface';

export const logger = new Logger(REDIS_CONTEXT);

const tokens: string[] = [];
export function validateRedisToken(token: string = DEFAULT_CONNECTION_NAME) {
  if (tokens.includes(token)) {
    throw new Error(`Redis connection name duplication for: ${token}`);
  }

  tokens.push(token);
  return token;
}

function createInstance(options: RedisModuleOptions): IORedis {
  if (options.connectUrl) {
    const url = options.connectUrl;
    delete options.connectUrl;
    return new IORedis(url, options);
  }

  return new IORedis(options);
}

export async function createClient(options: RedisModuleOptions) {
  const client = createInstance(options);
  if (options.onReady) {
    await options.onReady(client);
  }

  return client;
}

export function getConnectionToken(name: string = DEFAULT_CONNECTION_NAME) {
  return `${REDIS_BASE_TOKEN}${name}`;
}

export function valueOrDefault<T>(value: T | undefined, defaultValue: T): T {
  if (value === undefined) {
    return defaultValue;
  }

  return value;
}
