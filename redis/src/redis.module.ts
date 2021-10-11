import { Module, Global, OnApplicationShutdown, DynamicModule, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { REDIS_CLIENTS, REDIS_CLIENT_BASE } from './redis.constants';
import { getRedisToken } from './redis.decorator';
import { ModuleOptions } from './redis.interface';
import { createClientsMap, createClientsProvider } from './redis.provider';

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: ModuleOptions): DynamicModule {
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
 
    }
}
