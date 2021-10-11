import { Module, Global, OnApplicationShutdown, DynamicModule, Provider, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis, RedisOptions } from 'ioredis';
import { RedisClientStatus, REDIS_CLIENTS, REDIS_LOGGER_CONTEXT, REDIS_OPTIONS, REDIS_PROVIDER } from './redis.constants';
//import { getRedisToken } from './redis.decorator';
import { RedisModuleAsyncOptions } from './redis.interface';
import { createClientsMap, RedisProvider } from './redis.provider';

const logger = new Logger(REDIS_LOGGER_CONTEXT);

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: RedisOptions | RedisOptions[]): DynamicModule {
        const providers: Provider[] = [];
        const clientsMap = createClientsMap(options);

        providers.push({
            provide: REDIS_OPTIONS,
            useValue: options, 
        })
        
        providers.push({
            provide: REDIS_CLIENTS,
            useValue: clientsMap,
        });


        providers.push({
            provide: REDIS_PROVIDER,
            useClass: RedisProvider,
        });
        /*
        clientsMap.forEach((client, key) => {
            providers.push({
                provide: getRedisToken(key),
                useValue: client,
            });
        });
        */

        return {
            module: RedisModule,
            providers,
            exports: providers,
        }
    }
    
    static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const providers: Provider[] = [];
        providers.push({
            provide: REDIS_OPTIONS,
            inject: options.inject,
            useFactory: options.useFactory,
        });

        providers.push({
            provide: REDIS_CLIENTS,
            inject: [REDIS_OPTIONS],
            useFactory: (options: RedisOptions | RedisOptions[]) => {createClientsMap(options)},
        });

        providers.push({
            provide: REDIS_PROVIDER,
            useClass: RedisProvider,
        });

        return {
            module: RedisModule,
            imports: options.imports,
            providers,
            exports: providers,
        }
    }
    
    async onApplicationShutdown() {
        logger.log('Closing Redis connection...');
        type ClientsMap = Map<string, Redis>;
        const clientsMap = this.moduleRef.get<ClientsMap>(REDIS_CLIENTS);
        if (clientsMap) {
            const promises = [];
            clientsMap.forEach(client => {
                if (client.status === RedisClientStatus.READY) {
                    promises.push(client.quit());
                }

                client.disconnect();
            });

            await Promise.all(promises);
            logger.log('Redis connection closed successfuly');
        }
    }
}