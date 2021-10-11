import { ModuleMetadata } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export interface ModuleOptions extends RedisOptions {
    onReady: (client: Redis) => any;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any) => ModuleOptions | Promise<ModuleOptions>;
    inject?: any[];
    name?: string;
}