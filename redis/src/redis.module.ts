import { Module, Global, OnApplicationShutdown, DynamicModule, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis'
import { shutdownClient } from './common/common.utils';
import { DEFAULT_CONNECTION_NAME, REDIS_OPTIONS, REDIS_TOKEN } from './redis.constants';
import { ModuleOptions, RedisModuleAsyncOptions } from './redis.interface';
import { createClientProvider, createOptionsAsyncProvider, createOptionsProvider, createTokenProvider } from './redis.providers';
import { getConnectionToken, logger, validateRedisToken } from './redis.utils';

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_TOKEN) 
        private readonly clientToken: string,
        @Inject(REDIS_OPTIONS)
        private readonly clientOptions: ModuleOptions,
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: ModuleOptions): DynamicModule {
        const token = options.name;
        validateRedisToken(token);
        const clientToken = createTokenProvider(token);
        const clientOptions = createOptionsProvider(options);
        const clientProvider = createClientProvider(token);

        return {
            module: RedisModule,
            providers: [clientToken, clientOptions, clientProvider],
            exports: [clientProvider],
        }
    }
    
    static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const token = options.name;
        validateRedisToken(token);
        const clientToken = createTokenProvider(token);
        const clientOptions = createOptionsAsyncProvider(options);
        const clientProvider = createClientProvider(token);

        return {
            module: RedisModule,
            imports: options.imports,
            providers: [clientToken, clientOptions, clientProvider],
            exports: [clientProvider],
        }
    }
    
    async onApplicationShutdown() {
        const token = getConnectionToken(this.clientToken || DEFAULT_CONNECTION_NAME);
        const client = this.moduleRef.get<Redis>(token);

        if (this.clientOptions.beforeShutdown) {
            await this.clientOptions.beforeShutdown(client);
        }

        if (client) {
            logger.log(`Closing Redis connection: ${this.clientToken}`);
            await shutdownClient(client);
        }
    }
}