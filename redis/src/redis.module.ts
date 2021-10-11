import { Module, Global, OnApplicationShutdown, DynamicModule, Provider, Logger, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis'
import { DEFAULT_CONNECTION_NAME, REDIS_OPTIONS, REDIS_TOKEN } from './redis.constants';
import { ModuleOptions, RedisModuleAsyncOptions } from './redis.interface';
import { createClient, getConnectionToken, logger, shutdownClient } from './redis.utils';

const tokens: string[] = [];

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_TOKEN) 
        private readonly clientToken: string,
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: ModuleOptions): DynamicModule {
        const token = getConnectionToken(options.name || DEFAULT_CONNECTION_NAME);
        if (tokens.includes(token)) {
            throw new Error('Connection names duplication!');
        }

        tokens.push(token);

        const clientToken: Provider = {
            provide: REDIS_TOKEN,
            useValue: token,
        }

        const clientOptions: Provider = {
            provide: REDIS_OPTIONS,
            useValue: options,
        }

        const clientProvider: Provider = {
            provide: token,
            inject: [REDIS_OPTIONS],
            useFactory: createClient,
        }

        logger.log('Redis module created');

        return {
            module: RedisModule,
            providers: [clientToken, clientOptions, clientProvider],
            exports: [clientProvider],
        }
    }
    
    static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const token = getConnectionToken(options.name || DEFAULT_CONNECTION_NAME);
        if (tokens.includes(token)) {
            throw new Error('Connection names duplication!');
        }

        tokens.push(token);

        const clientToken: Provider = {
            provide: REDIS_TOKEN,
            useValue: token,
        }

        const clientOptions: Provider = {
            provide: REDIS_OPTIONS,
            inject: options.inject,
            useFactory: options.useFactory,
        }

        const clientProvider: Provider = {
            provide: token,
            inject: [REDIS_OPTIONS],
            useFactory: createClient,
        }

        logger.log('Redis module created');

        return {
            module: RedisModule,
            imports: options.imports,
            providers: [clientToken, clientOptions, clientProvider],
            exports: [clientProvider],
        }
    }
    
    async onApplicationShutdown() {
        const token = this.clientToken;
        const client = this.moduleRef.get<Redis>(token);

        if (client) {
            logger.log(`Closing Redis connection from ${token} module`);
            await shutdownClient(client);
        }
    }
}