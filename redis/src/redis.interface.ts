import { ModuleMetadata } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
    name: string;
    onReady?: (client: Redis) => any | Promise<any>;
    beforeShutdown?: (client: Redis) => any | Promise<any>;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any) => RedisModuleOptions | Promise<RedisModuleOptions>;
    inject?: any[];
    name?: string;
}