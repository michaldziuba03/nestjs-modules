import { Inject, Injectable, Provider } from '@nestjs/common';
import Redis, { RedisOptions, Redis as IRedis } from 'ioredis';
import { InjectRedisClients } from 'src';
import { REDIS_CLIENTS } from './redis.constants';

function createClient(options: RedisOptions) {
    const redis = new Redis(options);
    return redis;
}

function getConnectionName(options: RedisOptions) {
    return options.name;
}

export function createClientsMap(options: RedisOptions | RedisOptions[]) {
    const clients = new Map<string, IRedis>();

    if (Array.isArray(options)) {
        options.forEach(option => {
            const client = createClient(option);
            const key = getConnectionName(option);
            if (!key) {
                throw Error('In multi client setup, name parameter is required!');
            }

            clients.set(key, client);
        });

        return clients;
    }

    const client = createClient(options);
    const key = getConnectionName(options) || 'default';
    clients.set(key, client);

    return clients;
}

export function createClientsProvider(options: RedisOptions | RedisOptions[]): Provider {
    const clients = createClientsMap(options);
    
    return {
        provide: REDIS_CLIENTS,
        useValue: clients,
    }
}

@Injectable()
export class RedisProvider {
    constructor(
        @InjectRedisClients()
        private readonly redisClients: Map<string, IRedis>
    ) {}

    get(clientName: string = 'default') {
        return this.redisClients.get(clientName);
    }
}