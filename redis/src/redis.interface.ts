import { ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any) => RedisOptions | Promise<RedisOptions>;
    inject?: any[];
    name?: string;
}