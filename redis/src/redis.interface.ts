import Redis from 'ioredis';

export interface ClientOptions extends Redis.RedisOptions {
    connectionName: string;
}

export type ModuleOptions = ClientOptions | ClientOptions;