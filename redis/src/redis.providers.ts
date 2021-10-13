import { Provider } from "@nestjs/common";
import { DEFAULT_CONNECTION_NAME, REDIS_OPTIONS, REDIS_TOKEN } from "./redis.constants";
import { RedisModuleOptions, RedisModuleAsyncOptions } from "./redis.interface";
import { createClient, getConnectionToken } from "./redis.utils";

export function createTokenProvider(token: string = DEFAULT_CONNECTION_NAME): Provider {
    return {
        provide: REDIS_TOKEN,
        useValue: token,
    }
}

export function createClientProvider(token: string): Provider {
    return  {
        provide: getConnectionToken(token || DEFAULT_CONNECTION_NAME),
        inject: [REDIS_OPTIONS],
        useFactory: createClient,
    }
}

export function createOptionsProvider(options: RedisModuleOptions): Provider {
    return  {
        provide: REDIS_OPTIONS,
        useValue: options,
    }
}

export function createOptionsAsyncProvider(options: RedisModuleAsyncOptions): Provider  {
    return {
        provide: REDIS_OPTIONS,
        inject: options.inject,
        useFactory: options.useFactory,
    }
}