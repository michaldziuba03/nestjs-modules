import { Module, Global, OnApplicationShutdown, DynamicModule, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { REDIS_CLIENTS, REDIS_CLIENT_BASE } from './redis.constants';
import { getToken } from './redis.decorator';
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
        clientsMap.forEach((client, key) => {
            providers.push({
                provide: getToken(key),
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
