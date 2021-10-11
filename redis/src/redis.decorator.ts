import { Inject } from "@nestjs/common"
import { REDIS_CLIENT_BASE, REDIS_CLIENTS, REDIS_PROVIDER } from "./redis.constants"

export const getRedisToken = (clientName: string) => `${REDIS_CLIENT_BASE}${clientName}`;

/*
export const InjectRedis = (clientName: string = 'default') => {
    const token = getRedisToken(clientName);
    return Inject(token);
}
*/

export const InjectRedis = () => Inject(REDIS_PROVIDER);

export const InjectRedisClients = () => Inject(REDIS_CLIENTS);