import { Module, Global, OnApplicationShutdown, DynamicModule, Provider, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis, RedisOptions } from 'ioredis';
import { RedisClientStatus, REDIS_CLIENTS, REDIS_LOGGER_CONTEXT } from './redis.constants';
import { getRedisToken } from './redis.decorator';
import { createClientsMap } from './redis.provider';

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
            provide: REDIS_CLIENTS,
            useValue: clientsMap,
        });

        clientsMap.forEach((client, key) => {
            providers.push({
                provide: getRedisToken(key),
                useValue: client,
            })
        })
        
        return {
            module: RedisModule,
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