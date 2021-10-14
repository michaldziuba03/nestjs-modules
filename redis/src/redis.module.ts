import { Module, Global, OnApplicationShutdown, DynamicModule, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis'
import { shutdownClient } from './common/common.utils';
import { REDIS_OPTIONS, REDIS_TOKEN } from './redis.constants';
import { RedisModuleOptions, RedisModuleAsyncOptions } from './redis.interface';
import { createClientProvider, createOptionsAsyncProvider, createOptionsProvider, createTokenProvider } from './redis.providers';
import { getConnectionToken, logger, validateRedisToken } from './redis.utils';

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_TOKEN) 
        private readonly clientToken: string,
        @Inject(REDIS_OPTIONS)
        private readonly clientOptions: RedisModuleOptions,
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: RedisModuleOptions): DynamicModule {
        const token = validateRedisToken(options.name);
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
        const token = validateRedisToken(options.name);
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
        const token = getConnectionToken(this.clientToken);
        const client = this.moduleRef.get<Redis>(token);

        if (client) {
            if (this.clientOptions.beforeShutdown) {
                await this.clientOptions.beforeShutdown(client);
            }
            
            logger.log(`Closing Redis connection: ${this.clientToken}`);
            await shutdownClient(client);
        }
    }
}